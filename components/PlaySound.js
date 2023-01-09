import React from "react";
import { StopCircle, Volume2 } from "react-feather";
import dynamic from "next/dynamic";
// import DEFAULT_MUSIC from "../assets/default.mp3";
import AudioSpectrum from "react-audio-spectrum";

export default function PlaySound({ playText }) {
  let winObject = typeof window !== "undefined" ? window.speechSynthesis : null;
  const synthRef = React.useRef(winObject);
  let audio;
  const audioSource = "default.mp3";
  // const playAudio = new Audio("default.mp3");
  // const playAudio =
  const [audioElem, setAudioElem] = React.useState();

  React.useEffect(() => {
    if (typeof Audio !== "undefined" && audioSource) {
      const audio = new Audio(audioSource);
      setAudioElem(audio);
    }
  }, [audioSource]);

  const [langAVoices, setLangAVoices] = React.useState([]);
  const [langAVoice, setLangAVoice] = React.useState(null);
  const [voicePitch, setVoicePitch] = React.useState(1);
  const [voiceSpeed, setVoiceSpeed] = React.useState(1);
  const [backAudiVol, setBackAudioVol] = React.useState(0.1);

  if (winObject) {
    audio = document.createElement("audio");
    audio.setAttribute("id", "audio-element");
    audio.volume = backAudiVol;
  }

  // audio.volume = backAudiVol;

  React.useEffect(() => {
    setTimeout(() => {
      const voices = synthRef.current.getVoices();
      setLangAVoices(voices);
    }, 100);
  }, []);

  React.useEffect(() => {
    audio.volume = backAudiVol;
  }, [backAudiVol]);

  const choose = () => {
    console.log(playText);
    const utterThis = new SpeechSynthesisUtterance(playText);
    utterThis.voice = langAVoice;
    utterThis.rate = voiceSpeed;
    utterThis.pitch = voicePitch;
    synthRef.current.speak(utterThis);
    setDefaultBackgroundMusic();
  };

  function selectAccent(e) {
    setLangAVoice(langAVoices[e.target.value]);
  }

  function stopSpeechPlay() {
    synthRef.current.cancel();
    resetVoiceConfig();
  }

  const resetVoiceConfig = () => {
    setVoicePitch(1);
    setVoiceSpeed(1);
    audio.pause();
    audio.currentTime = 0;
    audio.src = null;
    synthRef.current.cancel();
  };

  function setDefaultBackgroundMusic() {
    audio.autoplay = true;
    audio.load();
    audio.addEventListener(
      "load",
      function () {
        audio.play();
      },
      true
    );
    audio.src = audioSource;
  }

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ fontSize: "1rem", color: "white" }}>
        Select accent <Volume2 color="white" onClick={choose} />
        <StopCircle onClick={stopSpeechPlay} />
        <div>
          Pitch : {voicePitch}
          <input
            type="range"
            min="-5"
            step="0.1"
            max="5"
            onChange={(e) => setVoicePitch(e.target.value)}
            value={voicePitch}
          ></input>
        </div>
        <div>
          Speed : {voiceSpeed}
          <input
            type="range"
            min="-5"
            step="0.1"
            max="5"
            onChange={(e) => setVoiceSpeed(e.target.value)}
            value={voiceSpeed}
          ></input>
        </div>
        <div>
          Background Music Volume : {backAudiVol}
          <input
            type="range"
            min="0"
            step="0.1"
            max="1"
            onChange={(e) => setBackAudioVol(e.target.value)}
            value={backAudiVol}
          ></input>
        </div>
        <button className="btn" onClick={resetVoiceConfig}>
          <span>Reset voice</span>
        </button>
        <div>Music upload</div>
      </h2>
      <div className="languages">
        <select onChange={(e) => selectAccent(e)}>
          {langAVoices.map((voice, index) => (
            <option key={voice.name} value={index}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>

      {/* <audio id="audio-element" src={audioSource} autoPlay></audio> */}

      <AudioSpectrum
        id="audio-canvas"
        height={200}
        width={300}
        audioId={"audio-element"}
        capColor={"red"}
        capHeight={2}
        meterWidth={2}
        meterCount={512}
        meterColor={[
          { stop: 0, color: "#f00" },
          { stop: 0.5, color: "#0CD7FD" },
          { stop: 1, color: "red" },
        ]}
        gap={4}
      />
    </div>
  );
}
