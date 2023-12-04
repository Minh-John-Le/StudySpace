import React, { useState } from "react";
import classes from "./PromptForm.module.css";
import Card from "../UI/Card/Card";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const PromptForm = (props) => {
  //===================== VARIABLE ===============================
  const [enterMessage, setEnterMessage] = useState("");
  const authToken = Cookies.get("authToken");

  //===================== FUNCTIONS ===============================
  const handleInputChange = (event) => {
    setEnterMessage(event.target.value);
  };

  // Input send message to chat room
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setEnterMessage("");

    const content = {
      content: enterMessage,
    };

    try {
      // Send a POST request to your backend login endpoint
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
        // Handle login error here (e.g., show an error message)
        console.error("Add new message fail");
        return;
      }

      const data = await response.json(); // Parse JSON from the response

      // Assuming the response is an object with the new QA data
      props.addNewQA(data);

      //const data = await response.json();
      setEnterMessage("");
      //props.fetchRoomMessage(id, authToken);
    } catch (error) {
      // Handle any other errors (e.g., network issues)
      console.error("An error occurred:", error);
    }
  };

  //===================== Return Components ===============================
  return (
    <Card>
      <form onSubmit={handleFormSubmit}>
        <div className={classes["message-box"]}>
          <input
            type="text"
            id="search"
            value={enterMessage}
            placeholder="Write Your Message Here"
            maxLength={256}
            onChange={handleInputChange}
          />
        </div>
      </form>
    </Card>
  );
};

export default PromptForm;
