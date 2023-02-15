import React, { useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

SpeechRecognition.stopListening();

export default function Commands() {

    const [display, setDisplay] = useState('') //display for our message
    SpeechRecognition.startListening({ continuous: true, language: "nl-NL" });
    const commands = [          
        {
            command: 'big chungus',          //command the user says, * is any input
            callback: () => document.getElementById("big").hidden = false  //set the display to this response
        }
    ]
    const {transcript, resetTranscript} = useSpeechRecognition( { commands })

    if (transcript.length > 0)
    {
        setTimeout(resetTranscript, 5000)
    }
    return (
        <div>
            <h1>Commando's</h1>
            <label>Zeg alles wat je wilt!</label>
            <p>{transcript}</p>     
            <p>{display}</p>
            <img hidden id="big" src="https://media.s-bol.com/7vN4DDKm6k1/550x676.jpg"></img>
        </div>
    )
}