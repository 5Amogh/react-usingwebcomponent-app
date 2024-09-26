import "./App.css";
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import "questionnaire-webcomponent/questionnaire-player-webcomponent.js";
import "questionnaire-webcomponent/styles.css";
import mockData from "./data.json";

function App() {
  const questionairePlayerMainRef = useRef(null);
  const [fileUploadResponse, setFileUploadResponse] = useState(null);
  const assessment = mockData;

  const uploadFileToPresignedUrl = async (event) => {
    const payload = {
      ref: "survey",
      request: {},
    };

    const submissionId = event.data.submissionId;
    payload.request[submissionId] = {
      files: [event.data.name],
    };

    try {
      const response = await axios.post(
        'presignedURL..', 
        payload
      );

      const presignedUrlData = response.data.result[submissionId].files[0];

      const uploadHeaders = { "Content-Type": "multipart/form-data" };
      await axios.put(presignedUrlData.url, event.data.file, {
        headers: uploadHeaders,
      });

      const obj = {
        name: event.data.name,
        url: presignedUrlData.url.split("?")[0],
        previewUrl: presignedUrlData.getDownloadableUrl[0],
      };

      for (const key of Object.keys(presignedUrlData.payload)) {
        obj[key] = presignedUrlData.payload[key];
      }

      setFileUploadResponse({
        status: 200,
        data: obj,
        question_id: event.data.question_id,
      });
    } catch (err) {
      setFileUploadResponse({
        status: 400,
        data: null,
        question_id: event.data.question_id,
      });
      console.error("Unable to upload the file. Please try again", err);
    }
  };

  const receiveUploadData = (event) => {
    if (event.data && event.data.file) {
      uploadFileToPresignedUrl(event);
    }
  };

  useEffect(() => {
    window.addEventListener("message", receiveUploadData, false);

    return () => {
      window.removeEventListener("message", receiveUploadData, false);
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