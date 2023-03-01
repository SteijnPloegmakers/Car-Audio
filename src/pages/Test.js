import { useEffect, useState } from 'react'

function Test() {

  const authEndpoint = "https://accounts.spotify.com/authorize/?"

  const clientId = "c12a19b4c59744a797e50a4c058b753e" // Find ClientID on Spotify Dashboard
  const redirectUri = "https://localhost:3000" // Where to go after sign in
  const scopes = [
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-modify-playback-state',
  ]

  let [token, setToken] = useState() // Authorization Token
  let [currSong, setCurrSong] = useState()

  useEffect(() => {

    // Get the token information from the URI

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
          is_playing: data.is_playing,
          progress_ms: data.progress_ms,
        });
      })
      .catch(error => console.error('Error fetching current song:', error));
  }

  const pauseSong = () => {

    fetch("https://api.spotify.com/v1/me/player/pause", {
      method: 'PUT',
      headers: {
        Authorization: "Bearer " + token
      }
    })

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
        // Get the updated song information directly from the Spotify API
        fetch("https://api.spotify.com/v1/me/player", {
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
              is_playing: data.is_playing,
              progress_ms: data.progress_ms,
            });
          })
          .catch(error => console.error('Error fetching current song:', error));
        console.log("Song changed successfully.");
      })
      .catch(error => console.error('Error changing song:', error));
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
        // Get the updated song information directly from the Spotify API
        fetch("https://api.spotify.com/v1/me/player", {
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
              is_playing: data.is_playing,
              progress_ms: data.progress_ms,
            });
          })
          .catch(error => console.error('Error fetching current song:', error));
        console.log("Song changed successfully.");
      })
      .catch(error => console.error('Error changing song:', error));
  }

  const playSong = () => {

    fetch("https://api.spotify.com/v1/me/player/play", {
      method: 'PUT',
      headers: {
        Authorization: "Bearer " + token
      }
    })

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
            <h2>{currSong.item.name}</h2>
            <p>{currSong.item.artists[0].name}</p>
            <div>
              <button onClick={playSong}>Play</button>
              <button onClick={pauseSong}>Pause</button>
              <button onClick={nextSong}>Next</button>
              <button onClick={previousSong}>Previous</button>
            </div>
          </>}
        </>
        )}
      </header>
    </div>
  );
}

export default Test;