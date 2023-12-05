import "./App.css";
import React, { useRef, useEffect, useState} from "react";
import "questionnaire-webcomponent/questionnaire-player-webcomponent.js";
import "./web-component/styles.css";
import mockData from "./data.json";
function App() {
  const questionairePlayerMainRef = useRef(null);
  const [fileUploadResponse, setFileUploadResponse] = useState(null);
  const assessment = mockData;
  const receiveUploadData = (event) => {
    if (event.data.question_id) {
    const obj = {
      name: event.data.name,
      url: URL.createObjectURL(event.data.file)
    };
    setFileUploadResponse({status:200, data:obj, question_id:event.data.question_id});
  }
  }

  useEffect(() => {
    window.addEventListener('message', receiveUploadData.bind(this), false);

    return () => {
      window.removeEventListener('message', receiveUploadData.bind(this), false);
    };
  }, []);

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
        fileuploadresponse={JSON.stringify(fileUploadResponse)}
        ref={questionairePlayerMainRef}
      ></questionnaire-player-main>
    </div>
  );
}

export default App;
