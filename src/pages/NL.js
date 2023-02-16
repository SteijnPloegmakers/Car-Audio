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
        },
        {
            command: ['speel (af)', 'ga verder', 'start', '*speel (af)*', '*ga verder*', '*start*'],
            callback: () =>  { setDisplay("Speel"); resetTranscript() },
            matchInterim: true
        },
        {
            command: ['stop', 'pauzeer', '*stop*', '*pauzeer*'],
            callback: () =>  { setDisplay("Stop"); resetTranscript() },
            matchInterim: true
        },
        {
            command: ['volgende', 'volgend nummer', 'volgend lied', '*volgende*', '*volgend nummer*', '*volgend lied*'],
            callback: () =>  { setDisplay("Volgende"); resetTranscript() },
            matchInterim: true
        },
        {
            command: ['vorige', 'vorig nummer', 'vorig lied', '*vorige*', '*vorig nummer*', '*vorig lied*'],
            callback: () =>  { setDisplay("Vorige"); resetTranscript() },
            matchInterim: true
        },
        {
            command: ['volume hoger', 'volume omhoog', '*volume hoger*', '*volume omhoog*'],
            callback: () =>  { setDisplay("Volume Hoger"); resetTranscript() },
            matchInterim: true
        },
        {
            command: ['volume lager', 'volume omlaag', '*volume lager*', '*volume omlaag*'],
            callback: () =>  { setDisplay("Volume Lager"); resetTranscript() },
            matchInterim: true
        }
    ]
    const { transcript, isMicrophoneAvailable, resetTranscript } = useSpeechRecognition({ commands })
    let amount;
    if (transcript.length > 0) {
        console.log(transcript)
        amount = transcript.length;
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition) {
        return (<div>
                    <label>Je browser wordt niet ondersteund!</label>
                </div>)
    }
    else if (!isMicrophoneAvailable) {
        return (<div>
                    <label>Je microfoon staat uit!</label>
                </div>)
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