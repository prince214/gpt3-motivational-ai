import React, { useRef } from "react";
import { RefreshCcw, StopCircle, Volume2 } from "react-feather";
import dynamic from "next/dynamic";
import AudioSpectrum from "react-audio-spectrum";

export default function PlaySound({ playText }) {
  let winObject = typeof window !== "undefined" ? window.speechSynthesis : null;
  const synthRef = React.useRef(winObject);
  let audio;
  const audioSource = "default.mp3";
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
  const [backAudiVol, setBackAudioVol] = React.useState(0.5);
  const [userUpload, setUserUpload] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  if (winObject) {
    // audio = document.createElement("audio");
    // audio.setAttribute("id", "audio-element");
    // audio.volume = backAudiVol;
  }

  let audioRef = useRef();
  // audio.volume = backAudiVol;

  React.useEffect(() => {
    setTimeout(() => {
      const voices = synthRef.current.getVoices();
      setLangAVoices(voices);
    }, 100);
    return () => {
      stopSpeechPlay();
    };
  }, []);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = backAudiVol;
    }
  }, [backAudiVol, audioRef]);

  const choose = () => {
    const utterThis = new SpeechSynthesisUtterance(playText);
    utterThis.voice = langAVoice;
    utterThis.rate = voiceSpeed;
    utterThis.pitch = voicePitch;
    synthRef.current.speak(utterThis);
    setDefaultBackgroundMusic();
    setIsPlaying(true);
    utterThis.addEventListener("end", (event) => {
      stopBackgroundMusic();
      setIsPlaying(false);
    });
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
    synthRef.current.cancel();
    stopBackgroundMusic();
  };

  const stopBackgroundMusic = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    // audioRef.current.src = null;
  };

  function setDefaultBackgroundMusic() {
    audioRef.current.autoplay = true;
    audioRef.current.load();
    audioRef.current.addEventListener(
      "load",
      function () {
        audioRef.current.play();
      },
      true
    );
    if (!audioRef.current.src) {
      audioRef.current.src = audioSource;
    }
  }

  function loadBackGroundMusic(event) {
    const files = event.target.files;
    audioRef.current.setAttribute("src", URL.createObjectURL(files[0]));
    // audioRef.current.load();
    audioRef.current.pause();
    synthRef.current.cancel();
  }

  React.useEffect(() => {
    const stopVoice = setTimeout(() => {
      synthRef.current.cancel();
    }, 2000);

    return () => clearTimeout(stopVoice);
  }, [voicePitch, voiceSpeed]);

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ fontSize: "1rem", color: "white" }}>
        <div className="languages">
          <span>Select accent</span>&nbsp;&nbsp;&nbsp;
          <select onChange={(e) => selectAccent(e)}>
            {langAVoices.length > 0 ? (
              langAVoices.map((voice, index) => (
                <option key={voice.name} value={index}>
                  {voice.name}
                </option>
              ))
            ) : (
              <option>Default</option>
            )}
          </select>
        </div>
        <div className="action_btns">
          <button
            className={`transparent_btn voice_play_btn ${
              isPlaying && "isPlaying"
            }`}
            onClick={() => choose()}
          >
            Play &nbsp;
            <Volume2 color="white" size={20} />
          </button>

          <button className="transparent_btn" onClick={stopSpeechPlay}>
            Stop &nbsp;
            <StopCircle size={20} />
          </button>

          <button className="transparent_btn" onClick={resetVoiceConfig}>
            Reset voice &nbsp; <RefreshCcw size={18} />
          </button>
        </div>

        <div className="play_configuration">
          <div className="config_box">
            <div>Voice Pitch : {voicePitch}</div>
            <input
              type="range"
              min="-5"
              step="0.1"
              max="5"
              onChange={(e) => setVoicePitch(e.target.value)}
              value={voicePitch}
            ></input>
          </div>

          <div className="config_box">
            <div>Voice Speed : {voiceSpeed}</div>
            <input
              type="range"
              min="-5"
              step="0.1"
              max="5"
              onChange={(e) => setVoiceSpeed(e.target.value)}
              value={voiceSpeed}
            ></input>
          </div>
          <div className="config_box">
            <div>Background Music Volume : {backAudiVol}</div>
            <input
              type="range"
              min="0"
              step="0.01"
              max="1"
              onChange={(e) => setBackAudioVol(e.target.value)}
              value={backAudiVol}
            ></input>
          </div>
        </div>

        <div style={{ textAlign: "center" }} className="music_upload_container">
          {/* {userUpload ? (
            <>
              <input type="file" onChange={loadBackGroundMusic} />

              <audio id="audio-element" ref={audioRef} controls>
                <source src={audioElem} id="src" />
              </audio>
            </>
          ) : (
            <button
              className="transparent_btn"
              onClick={() => setUserUpload(true)}
            >
              Change Background music
            </button>
          )} */}

          <div
            className={`music_upload_container ${userUpload ? "" : "d-none"}`}
          >
            <input
              type="file"
              accept="audio/mp3,audio/"
              onChange={loadBackGroundMusic}
            />

            <audio id="audio-element" ref={audioRef} controls>
              <source src={audioElem} id="src" />
            </audio>
          </div>

          <button
            className={`transparent_btn ${!userUpload ? "d-block" : "d-none"}`}
            onClick={() => setUserUpload(true)}
          >
            Change Background music
          </button>
        </div>
      </h2>

      {/* <audio id="audio-element" src={audioSource} autoPlay></audio> */}

      {/* <AudioSpectrum
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
      /> */}
    </div>
  );
}
