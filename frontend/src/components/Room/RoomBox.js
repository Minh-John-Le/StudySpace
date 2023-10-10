import React, { useEffect, useState } from "react";
import Card from "../UI/Card/Card";
import classes from "./RoomBox.module.css";
import { Link } from "react-router-dom";
import ConversationBox from "./ConversationBox";
import MessageForm from "./MessageForm";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const RoomBox = (props) => {
  const [messages, setMessages] = useState([]);
  const [roomMetaContent, setRoomMetaContent] = useState([]);
  const authToken = Cookies.get("authToken");
  const { id } = useParams();

  async function fetchRoomMessage(id, authToken) {
    const apiUrl = `http://localhost:8000/api/database/room-message/${id}/`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const roomMessages = await response.json();

      // Format the created_at property for each message
      const formattedMessages = roomMessages.map((message) => ({
        ...message,
        created_at: formatCreatedAt(message.created_at), // Replace formatCreatedAt with your formatting logic
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching follow status:", error);
    }
  }

  function formatCreatedAt(created_at) {
    const date = new Date(created_at);
    // Convert to local time
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );

    const formattedDate = localDate.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return formattedDate;
  }

  useEffect(() => {
    fetchRoomMessage(id, authToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, id]);

  useEffect(() => {
    async function fetchData() {
      const apiUrl = `http://localhost:8000/api/database/room-meta-content/${id}/`;

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const roomMetaContent = await response.json();
        setRoomMetaContent(roomMetaContent);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    if (authToken) {
      fetchData(); // Call the function here if authToken is available
    }
  }, [authToken, id]);

  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h3>{"Java Best Room 123 "}</h3>
      </Card>

      <Card className={classes.body}>
        <div className={classes.roomInfo}>
          <div className={classes["room-name"]}>{"Java Best Room 123 "}</div>
          <div className={classes["button-group"]}>
            <button className={classes["btn__actions"]}>{"Join"}</button>
            <button className={classes["btn__actions"]}>{"Edit"}</button>
          </div>
        </div>

        <div className={classes.description}>{roomMetaContent.created_ago} {"ago"}</div>
        <div className={classes.subtitle}>HOSTED BY</div>
        <Link
          to={`/user/${roomMetaContent.host}`}
          className={classes.avatarLink}
        >
          <div className={classes.avatarContainer}>
            <img
              src={roomMetaContent.host_image_url}
              alt="Avatar"
              className={classes.avatar}
            />
          </div>
          <span className={classes["avatarLink__display-name"]}>
            {roomMetaContent.host_display_name}
          </span>
        </Link>
        <ConversationBox messages={messages}></ConversationBox>
        <MessageForm fetchRoomMessage={fetchRoomMessage}></MessageForm>
      </Card>
    </React.Fragment>
  );
};

export default RoomBox;
