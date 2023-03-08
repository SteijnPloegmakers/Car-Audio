import { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function Test() {

  const authEndpoint = "https://accounts.spotify.com/authorize/?"

  const clientId = "c12a19b4c59744a797e50a4c058b753e"
  const redirectUri = "https://i491216.hera.fhict.nl"
  const scopes = [
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-modify-playback-state',
  ]

  let [token, setToken] = useState()
  let [currSong, setCurrSong] = useState();

  const [time, setTime] = useState();
  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState();

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);

    } else if (!running) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (time >= duration) {
      getCurrentSong(token);
    }
  })

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce(function (initial, item) {
        if (item) {
          var parts = item.split("=");
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});
    window.location.hash = "";

    let _token = hash.access_token
    if (_token) {
      setToken(_token)
      getCurrentSong(_token)
    }
  }, [])


  const getCurrentSong = async (token) => {
    await fetch("https://api.spotify.com/v1/me/player", {
      method: 'GET',
      headers: {
        Authorization: "Bearer " + token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(data => {
        console.log(data);
        setCurrSong({
          item: data.item,
        });
        console.log(data.item.duration_ms)
        setTime(data.progress_ms)
        setDuration(data.item.duration_ms)
        console.log(data.is_playing)
        setRunning(data.is_playing)
      })
      .catch(error => console.error('Error fetching current song:', error))
  }

  const playSong = () => {

    fetch("https://api.spotify.com/v1/me/player/play", {
      method: 'PUT',
      headers: {
        Authorization: "Bearer " + token
      }
    })
    setRunning(true)
  }

  const pauseSong = () => {
    fetch("https://api.spotify.com/v1/me/player/pause", {
      method: 'PUT',
      headers: {
        Authorization: "Bearer " + token
      }
    })
    setRunning(false)
  }

  const nextSong = async () => {
    await fetch("https://api.spotify.com/v1/me/player/next", {
      method: 'POST',
      headers: {
        Authorization: "Bearer " + token,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        console.log(res);
      })
      .catch(error => console.error('Error changing song:', error));

    await sleep(500)
    getCurrentSong(token)
  }

  const previousSong = async () => {
    await fetch("https://api.spotify.com/v1/me/player/previous", {
      method: 'POST',
      headers: {
        Authorization: "Bearer " + token,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        console.log(res);
      })
      .catch(error => console.error('Error changing song:', error));

    await sleep(500)
    getCurrentSong(token)
  }

  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  const commands = [
    {
      command: ['play', 'continue', 'start', '*play*', '*continue*', '*start*'],
      callback: () => { playSong(); resetTranscript() },
      matchInterim: true
    },
    {
      command: ['stop', 'pause', '*stop*', '*pause*'],
      callback: () => { pauseSong(); resetTranscript() },
      matchInterim: true
    },
    {
      command: ['next (song) (track)', 'skip', '*next (song) (track)*', '*skip*'],
      callback: () => { nextSong(); resetTranscript() },
      matchInterim: true
    },
    {
      command: ['previous (song) (track)', 'go back', '*previous (song) (track)*', '*go back*'],
      callback: () => { previousSong(); resetTranscript() },
      matchInterim: true
    },
    // {
    //     command: ['volume up', 'volume higher', '*volume up*', '*volume higher*'],
    //     callback: () =>  { setDisplay("Volume Up"); resetTranscript() },
    //     matchInterim: true
    // },
    // {
    //     command: ['volume down', 'volume lower', '*volume down*', '*volume lower*'],
    //     callback: () =>  { setDisplay("Volume Down"); resetTranscript() },
    //     matchInterim: true
    // }
  ]
  const { transcript, isMicrophoneAvailable, resetTranscript } = useSpeechRecognition({ commands })
  // if (transcript.length > 0) {
  //   console.log(transcript)
  // }

  if (!SpeechRecognition.browserSupportsSpeechRecognition) {
    return (<div>
      <label>Your browser is not supported!</label>
    </div>)
  }
  else if (!isMicrophoneAvailable) {
    return (<div>
      <label>Your microphone is disabled!</label>
    </div>)
  }


  return (
    <div className="App">
      <header className="App-header">

        {!token && (
          <a
            className="btn btn--loginApp-link"
            href={`${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
          >
            <button>Login to Spotify</button>
          </a>
        )}
        {token && (<>
          {currSong && <>
            <img src={currSong.item.album.images[0].url} alt="Album Cover" width="25%" height="25%" />
            <h3>{currSong.item.name}</h3>
            <p>{currSong.item.artists[0].name}</p>
            <div>
              <button onClick={playSong}>Play</button>
              <button onClick={pauseSong}>Pause</button>
              <button onClick={nextSong}>Next</button>
              <button onClick={previousSong}>Previous</button>
            </div>
            <br />
            <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
            <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
            {running &&
              <p>is running</p>}
            {!running &&
              <p>is not running</p>}
            <p>{transcript}</p>
          </>}
        </>
        )}
      </header>
    </div>
  );
}

export default Test;