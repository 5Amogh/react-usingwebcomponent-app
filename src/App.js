import "./App.css";
import React, { useRef, useEffect } from "react";
import "./web-component/questionnaire-player-webcomponent.js";
import "./web-component/styles.css";
import mockData from "./data.json";
function App() {
  const questionairePlayerMainRef = useRef(null);
  const assessment = mockData
  useEffect(() => {
    const playerElement = questionairePlayerMainRef.current;
    const handlePlayerSubmitOrSaveEvent = (event) => {
      console.log("Event Data Logged from the react app", event.detail);
    };

    playerElement.addEventListener(
      "submitOrSaveEvent",
      handlePlayerSubmitOrSaveEvent
    );

    // Cleanup: removing the event listener when the component is unmounted
    return () => {
      playerElement.removeEventListener(
        "submitOrSaveEvent",
        handlePlayerSubmitOrSaveEvent
      );
    };
  }, []);

  return (
    <div>
      <questionnaire-player-main
        assessment={JSON.stringify(assessment)}
        ref={questionairePlayerMainRef}
      ></questionnaire-player-main>
    </div>
  );
}

export default App;
