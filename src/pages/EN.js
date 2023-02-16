import React, { useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

SpeechRecognition.stopListening();

export default function Commands() {
    const [display, setDisplay] = useState('') //display for our message
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    const commands = [
        {
            command: ['big chungus', '*big chungus*'],          //command the user says, * is any input
            callback: () => document.getElementById("big").hidden = false,  //set the display to this response
            matchInterim: true
        },
        {
            command: ['play', 'continue', 'start', '*play*', '*continue*', '*start*'],
            callback: () =>  { setDisplay("Play"); resetTranscript() },
            matchInterim: true
        },
        {
            command: ['stop', 'pause', '*stop*', '*pause*'],
            callback: () =>  { setDisplay("Stop"); resetTranscript() },
            matchInterim: true
        },
        {
            command: ['next (song) (track)', 'skip', '*next (song) (track)*', '*skip*'],
            callback: () =>  { setDisplay("Next"); resetTranscript() },
            matchInterim: true
        },
        {
            command: ['previous (song) (track)', 'go back', '*previous (song) (track)*', '*go back*'],
            callback: () =>  { setDisplay("Previous"); resetTranscript() },
            matchInterim: true
        },
        {
            command: ['volume up', 'volume higher', '*volume up*', '*volume higher*'],
            callback: () =>  { setDisplay("Volume Up"); resetTranscript() },
            matchInterim: true
        },
        {
            command: ['volume down', 'volume lower', '*volume down*', '*volume lower*'],
            callback: () =>  { setDisplay("Volume Down"); resetTranscript() },
            matchInterim: true
        }
    ]
    const { transcript, isMicrophoneAvailable, resetTranscript } = useSpeechRecognition({ commands })
    if (transcript.length > 0) {
        console.log(transcript)
    }

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
        <div>
            <h1>Commands</h1>
            <label>Say anything you want!</label>
            <p>{transcript}</p>
            <p>{display}</p>
            <img hidden id="big" src="https://media.s-bol.com/7vN4DDKm6k1/550x676.jpg" alt="bigchungus"></img>
        </div>
    )
}