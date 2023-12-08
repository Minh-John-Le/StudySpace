import React, { useState } from "react";
import classes from "./PromptForm.module.css";
import Card from "../UI/Card/Card";
import Cookies from "js-cookie";
import { BiSend } from "react-icons/bi";
import { MdInsertPhoto } from "react-icons/md";
import { useEffect } from "react";
import { createWorker } from "tesseract.js";
import { FaMicrophone } from "react-icons/fa";

const PromptForm = (props) => {
  const [enterMessage, setEnterMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const authToken = Cookies.get("authToken");

  const handleInputChange = (event) => {
    setEnterMessage(event.target.value);
  };

  //======================================= FUNCTION ======================================
  //----------------------- Send message to study bot ----------------------
  // Handle submit the question message to chat bot
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (isLoading || !enterMessage.trim()) {
      return; // If already loading, prevent new submissions
    }

    setIsLoading(true);
    setEnterMessage("Study Bot is thinking. Please wait ....");

    const content = {
      content: enterMessage,
    };

    try {
      const apiUrl = `http://localhost:8000/api/chatbot/`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        console.error("Cannot get answer from Study Bot!");
        return;
      }

      const data = await response.json();
      props.addNewQA(data);
      setEnterMessage("");
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //----------------------- Convert image to text ----------------------
  const convertImageToText = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setEnterMessage("Study Bot is reading your file. Please wait ....");

    const workerInstance = await createWorker("eng");
    try {
      const ret = await workerInstance.recognize(selectedImage);
      setEnterMessage(ret.data.text);
    } finally {
      setTimeout(() => {
        if (workerInstance.terminate) {
          workerInstance.terminate();
        }
      }, 1000);

      setIsLoading(false);
    }
  };

  useEffect(() => {
    convertImageToText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage]);

  const handleChangeImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    } else {
      setSelectedImage(null);
      setEnterMessage("");
    }
  };

  //======================================= RETURN COMPONENTS ======================================
  return (
    <React.Fragment>
      <Card>
        <div className={classes["message-box"]}>
          <textarea
            className={classes["message-box__textarea"]}
            id="search"
            type="text"
            value={enterMessage}
            placeholder="Write Your Message Here"
            maxLength={4068}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit(e);
              }
            }}
            disabled={isLoading} // Disable input during loading
          />
        </div>
      </Card>

      <div className={classes["action-button-group"]}>
        <button className={classes["action-button"]}>
          <BiSend
            size={32}
            className={classes["button-icon"]}
            onClick={handleFormSubmit}
          />
        </button>

        <div>
          <label htmlFor="imageInput" className={classes["image-input"]}>
            <MdInsertPhoto size={34} className={classes["image-input-icon"]} />
          </label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleChangeImage}
            style={{ display: "none" }}
          />
        </div>

        <button className={classes["voice-button"]}>
          <FaMicrophone size={32} className={classes["voice-icon"]} />
        </button>
      </div>

      <div>
        {selectedImage && (
          <div className={classes["upload-image"]}>
            <img src={URL.createObjectURL(selectedImage)} alt="thumb" />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default PromptForm;
