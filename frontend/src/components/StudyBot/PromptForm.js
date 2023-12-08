import React, { useState, useMemo, useCallback } from "react";
import classes from "./PromptForm.module.css";
import Card from "../UI/Card/Card";
import Cookies from "js-cookie";
import { BiSend } from "react-icons/bi";
import { MdInsertPhoto } from "react-icons/md";
import { useEffect } from "react";
import { createWorker } from "tesseract.js";
import { FaMicrophone } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";
import Select from "react-select";
import { SiProbot } from "react-icons/si";

const PromptForm = (props) => {
  //======================================= VARIABLES ===================================
  //--------------------------- General Input Variable ------------------------------------
  const [enterMessage, setEnterMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const authToken = Cookies.get("authToken");

  //--------------------------- Image Input Variable ------------------------------------
  const [selectedImage, setSelectedImage] = useState(null);

  //--------------------------- Voice Input Variable ------------------------------------
  const [isVoiceOn, setIsVoiceOn] = useState(false);

  const mic = useMemo(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const micInstance = new SpeechRecognition();
    micInstance.continuous = true;
    micInstance.interimResults = true;
    micInstance.lang = "en-US";
    return micInstance;
  }, []);

  //--------------------------- Bot Option -----------------------
  const [botOption, setBotOption] = useState("option1");

  const options = [
    {
      value: "option1",
      label: (
        <div>
          <FaRobot size={42} /> <h2> Study Bot</h2>
        </div>
      ),
    },
    {
      value: "option2",
      label: (
        <div>
          <SiProbot size={42} /> <h2> Experiment Bot</h2>
        </div>
      ),
    },
  ];

  //======================================= FUNCTION ======================================
  //----------------------- Send message to study bot ----------------------
  const handleInputChange = (event) => {
    setEnterMessage(event.target.value);
  };

  // Handle submit the question message to chat bot
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (isLoading || !enterMessage.trim()) {
      return; // If already loading, prevent new submissions
    }

    setIsLoading(true);
    setIsVoiceOn(false);
    setEnterMessage("Study Bot is thinking. Please wait ....");

    const content = {
      content: enterMessage,
    };

    try {
      const apiUrl = "http://localhost:8000/api/chatbot/";
      const timeoutDuration = 180000; // 3 minutes in milliseconds

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Request timed out")),
          timeoutDuration
        )
      );

      const fetchPromise = fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(content),
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        console.error("Cannot get answer from Study Bot!");
        return;
      }

      const data = await response.json();
      props.addNewQA(data);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
      setEnterMessage("");
    }
  };

  //----------------------- Convert image to text ----------------------
  const convertImageToText = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setIsVoiceOn(false);

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

  //---------------------- Voice Function -------------------------------
  const handleOnClickVoiceButton = (event) => {
    event.preventDefault();
    setIsVoiceOn((prevIsVoiceOn) => {
      console.log(!prevIsVoiceOn);
      return !prevIsVoiceOn;
    });
  };

  const handleListen = useCallback(() => {
    if (isVoiceOn && !mic.isActive) {
      setEnterMessage("");
      mic.start();
      mic.isActive = true;

      mic.onend = () => {
        mic.isActive = false;
      };

      mic.onstart = () => {
        //console.log("Mics on");
      };

      mic.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setEnterMessage(transcript);
      };

      mic.onerror = (event) => {
        console.log(event.error);
      };
    } else if (!isVoiceOn && mic.isActive) {
      mic.stop();
      mic.isActive = false;
    }
  }, [isVoiceOn, setEnterMessage, mic]);

  useEffect(() => {
    handleListen();
    return () => {
      mic.stop();
    };
  }, [isVoiceOn, mic, handleListen]);

  //---------------------- Bot Change Function -------------------------------
  // const handleBotOptionChange = (event) => {
  //   const selectedOption = event.target.value;
  //   setBotOption(selectedOption);
  // };

  const handleBotOptionChange = (selectedOption) => {
    setBotOption(selectedOption);
    // Additional logic if needed
  };
  //======================================= RETURN COMPONENTS ======================================
  return (
    <React.Fragment>
      <Card>
        {/* ---------------------------- Message Box Component -----------------------------*/}
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
            disabled={isLoading || isVoiceOn} // Disable input during loading
          />
        </div>
      </Card>

      {/* Action Button Group Component */}
      <div className={classes["action-button-group"]}>
        {/* Send Button */}
        <button className={classes["action-button"]}>
          <BiSend
            size={32}
            className={classes["button-icon"]}
            onClick={handleFormSubmit}
          />
        </button>

        {/*----------------------------- Image Input Button ------------------------- */}
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

        {/*------------------------------ Voice Button -------------------------------*/}
        <button
          className={`${
            isVoiceOn
              ? classes["action-button-selected"]
              : classes["action-button"]
          }`}
        >
          <FaMicrophone
            size={32}
            className={`${
              isVoiceOn
                ? classes["button-icon-selected"]
                : classes["button-icon"]
            }`}
            onClick={handleOnClickVoiceButton}
          />
        </button>

        {/*------------------------------- Dropdown Button ---------------------------*/}
        <div>
          <Select
            id="botOption"
            value={botOption}
            onChange={handleBotOptionChange}
            options={options}
          />
        </div>
      </div>

      {/*---------------------------- Uploaded Image Component -----------------------*/}
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
