import './App.css';
import React, { useState, useRef } from 'react';
import Lottie from 'lottie-react';
import animationData from './animate.json'; // Import the provided Lottie animation
import intents from './data.json';

function App() {
  const [chatLog, setChatLog] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const outputRef = useRef(null);
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef(new SpeechRecognition()).current;

  function stopRecognition() {
    recognition.stop();
  }

  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = function (event) {
    let userQuestion = event.results[0][0].transcript;
    let botAnswer = findAnswer(userQuestion);

    setChatLog((prevLog) => [
      ...prevLog,
      { user: userQuestion, bot: botAnswer },
    ]);
    setIsSpeaking(true); // Start Lottie speaking animation
    speak(botAnswer);
  };

  
const findAnswer = (question) => {
    for (let intent of intents.intents) {
        for (let pattern of intent.patterns) {
            if (question.toLowerCase().includes(pattern.toLowerCase())) {
                return intent.responses[Math.floor(Math.random() * intent.responses.length)];
            }
        }
    }
    return "I'm sorry, I don't know the answer to that.";
};


  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false); // End Lottie speaking animation
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    recognition.start();
  };

  return (
    <div className="App">
      <lottie-player
        src="https://lottie.host/0f00b7f9-ab97-407d-88e7-b32f4a0f6d1b/ICuiMqfAKA.json"
        background="#fff"
        speed="1"
        style={{ width: '300px', height: '300px', display: isSpeaking ? "block" : "none" }}
        loop
                autoplay={isSpeaking}
        direction="1"
        mode="normal"
      ></lottie-player>
      {/* Use the provided Lottie animation */}
      <Lottie
        options={defaultOptions}
        isPaused={!isSpeaking} // Control Lottie's paused state based on isSpeaking
      />
      <button onClick={startListening}>Ask a Question</button>
      <div className="chatLog">
        {chatLog.map((entry, index) => (
          <div key={index}>
            <div className="userQuestion">{entry.user}</div>
            <div className="botAnswer">{entry.bot}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;