import React, { useState } from "react";
import classes from "./MessageForm.module.css";
import Card from "../UI/Card/Card";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const MessageForm = (props) => {
  //===================== VARIABLE ===============================
  const [enterMessage, setEnterMessage] = useState("");
  const authToken = Cookies.get("authToken");
  const { id } = useParams();
  const wsURL = process.env.REACT_APP_WEBSOCKET_URL;

  //===================== FUNCTIONS ===============================
  const handleInputChange = (event) => {
    setEnterMessage(event.target.value);
  };

  const socket = new WebSocket(`${wsURL}/ws/room/${id}/`);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Check if the socket is open before sending a message
    if (socket.readyState === WebSocket.OPEN) {
      const messageData = {
        message: enterMessage,
        token: authToken,
      };
      socket.send(JSON.stringify(messageData));
    }

    setEnterMessage("");
  };

  // Input send message to chat room
  // const handleFormSubmit = async (event) => {
  //   event.preventDefault();

  // const content = {
  //   content: enterMessage,
  // };

  // try {
  //   // Send a POST request to your backend login endpoint
  //   const apiUrl = `http://localhost:8000/api/database/room-message/${id}/`;

  //   const response = await fetch(apiUrl, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Token ${authToken}`,
  //     },
  //     body: JSON.stringify(content),
  //   });

  //   if (!response.ok) {
  //     // Handle login error here (e.g., show an error message)
  //     console.error("Add new message fail");
  //     return;
  //   }

  //   //const data = await response.json();
  //   setEnterMessage("");
  //   props.fetchRoomMessage(id, authToken);
  // } catch (error) {
  //   // Handle any other errors (e.g., network issues)
  //   console.error("An error occurred:", error);
  // }
  // };

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

export default MessageForm;
