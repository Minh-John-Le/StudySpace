import React, { useState } from "react";
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
import { RiRobotFill } from "react-icons/ri";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const selectBotStyle = {
  control: (provided) => ({
    ...provided,
    maxWidth: "40px",
    maxHeight: "40px",
    minWidth: "40px",
    minHeight: "40px",
    backgroundColor: "transparent",
    border: "3px solid var(--color-main)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ":hover": {
      border: "3px solid var(--color-main-hover)",
    },
  }),
  menu: (provided) => ({
    ...provided,
    minWidth: "60px",
    backgroundColor: "transparent",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: "var(--color-dark)",
    border: "3px solid var(--color-main)",
    color: state.isSelected ? "white" : "black",
    ":hover": {
      border: "3px solid var(--color-main-hover)",
      color: "white",
    },
  }),
  indicatorsContainer: () => ({ display: "none" }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "0px", // Increase padding to move the inner display away from the border
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0px", // Increase padding to move the inner display away from the border
  }),
};

const PromptForm = (props) => {
  //======================================= VARIABLES ===================================
  //--------------------------- General Input Variable ------------------------------------
  const [enterMessage, setEnterMessage] = useState("");

  //------------------------------- API --------------------------------
  const [isLoading, setIsLoading] = useState(false);
  const authToken = Cookies.get("authToken");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //--------------------------- Image Input Variable ------------------------------------
  const [selectedImage, setSelectedImage] = useState(null);

  //--------------------------- Voice Input Variable ------------------------------------
  const [isVoiceOn, setIsVoiceOn] = useState(false);
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  //--------------------------- Bot Option -----------------------

  const options = [
    {
      value: "openAI",
      label: (
        <div className={classes["study-bot-openAI"]}>
          <FaRobot size={24} />
        </div>
      ),
    },
    {
      value: "llama",
      label: (
        <div className={classes["study-bot-llama"]}>
          <SiProbot size={24} />
        </div>
      ),
    },
    {
      value: "mini_llama",
      label: (
        <div className={classes["study-bot-mini-llama"]}>
          <RiRobotFill size={24} />
        </div>
      ),
    },
  ];

  const [botOption, setBotOption] = useState(options[0]);
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
    setEnterMessage("AI Bot is thinking. Please wait ....");

    const content = {
      content: enterMessage,
      ai_model: botOption.value,
    };

    //console.log(botOption.value);
    try {
      const apiUrl = `${backendUrl}/api/chatbot/`;
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
        console.error("Cannot get answer from AI Bot!");
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

    setEnterMessage("AI Bot is reading your file. Please wait ....");

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

  useEffect(() => {
    if (isVoiceOn) {
      setEnterMessage("");
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isVoiceOn]);

  const handleOnClickVoiceButton = (event) => {
    event.preventDefault();
    setIsVoiceOn((prevIsVoiceOn) => !prevIsVoiceOn);
    resetTranscript(); // Reset the transcript when toggling voice on/off
  };

  useEffect(() => {
    if (transcript) {
      setEnterMessage(transcript);
    }
  }, [transcript]);

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
            className="bot-select"
          />
        </div>

        {/*------------------------------ Voice Button -------------------------------*/}
        {browserSupportsSpeechRecognition && isMicrophoneAvailable && (
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
        )}
        {/*------------------------------- Dropdown Button ---------------------------*/}
        <div>
          <Select
            id="botOption"
            value={botOption}
            onChange={handleBotOptionChange}
            options={options}
            styles={selectBotStyle}
            isSearchable={false}
            menuPlacement="top"
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
