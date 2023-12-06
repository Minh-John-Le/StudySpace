import React, { useState } from "react";
import classes from "./PromptForm.module.css";
import Card from "../UI/Card/Card";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { BiSend } from "react-icons/bi";
import { MdInsertPhoto } from "react-icons/md";
import OCRConverter from "./OCRConverter";

const PromptForm = (props) => {
  const [enterMessage, setEnterMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const authToken = Cookies.get("authToken");

  const handleInputChange = (event) => {
    setEnterMessage(event.target.value);
  };

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
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  };

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
        <button className={classes["action-button"]}>
          <MdInsertPhoto size={32} className={classes["button-icon"]} />
        </button>
      </div>

      <OCRConverter></OCRConverter>
    </React.Fragment>
  );
};

export default PromptForm;
