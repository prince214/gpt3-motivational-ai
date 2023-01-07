import React from "react";
import { StopCircle, Volume2 } from "react-feather";

export default function PlaySound({ playText }) {
  const winObject =
    typeof window !== "undefined" ? window.speechSynthesis : null;
  const synthRef = React.useRef(winObject);
  const [langAVoices, setLangAVoices] = React.useState([]);
  const [langAVoice, setLangAVoice] = React.useState(null);
  const [sliderVal, setSliderVal] = React.useState(1);

  React.useEffect(() => {
    setTimeout(() => {
      const voices = synthRef.current.getVoices();
      setLangAVoices(voices);
    }, 100);
  }, []);

  const choose = () => {
    console.log(playText);
    const utterThis = new SpeechSynthesisUtterance(playText);
    utterThis.voice = langAVoice;
    utterThis.rate = 1;
    synthRef.current.speak(utterThis);
  };

  function selectAccent(e) {
    setLangAVoice(langAVoices[e.target.value]);
  }

  function stopSpeechPlay() {
    synthRef.current.cancel();
  }

  const changeCallback = (e) => {
    setSliderVal(e.target.value); // update local state of the value when changing
  };

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ fontSize: "1rem", color: "white" }}>
        Select accent <Volume2 color="white" onClick={choose} />
        <StopCircle onClick={stopSpeechPlay} />
        <div>
          Pitch : {sliderVal}
          <input
            type="range"
            min="0"
            step="0.1"
            max="5"
            onChange={changeCallback}
            value={sliderVal}
          ></input>
        </div>
        Music upload
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
    </div>
  );
}
