import { useState } from "react";
import PlaySound from "../components/PlaySound";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  const placeholder = `-> below are some example texts: 
# success, power, consistent, focussed.
# hardwork
# confindence
`;

  return (
    <div className="root">
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Enter words to generate motivational text</h1>
          </div>
          <div className="header-subtitle">
            <h2>Power Up Your Motivation with AI-Powered Speech Generator!</h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea
            className="prompt-box"
            placeholder={placeholder}
            value={userInput}
            onChange={onUserChangedText}
          />
          <div className="prompt-buttons">
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? (
                  <>
                    <span className="loader"></span>&nbsp;generating
                  </>
                ) : (
                  <p>Generate</p>
                )}
              </div>
            </a>
          </div>
          <PlaySound playText={apiOutput} />
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>

              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://github.com/prince214/"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            👑&nbsp;&nbsp;&nbsp;
            <p>Made by Prince&nbsp;Paraste</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
