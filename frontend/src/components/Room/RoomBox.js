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
  const [memberStatus, setMemberStatus] = useState([]);
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

  async function fetchMemberStatus(id, authToken) {
    const apiUrl = `http://localhost:8000/api/database/member-in-room/${id}/`;

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

      const data = await response.json();

      setMemberStatus(data);
      props.changeMemberStatus(data);

      // Format the created_at property for each message
    } catch (error) {
      console.error("Error fetching member status:", error);
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

  const joinRoom = async (roomId, authToken) => {};

  const leaveRoom = async (roomId, authToken) => {
    const apiUrl = `http://localhost:8000/api/database/member-in-room/${roomId}/`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE", // You might need to adjust this depending on your API
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // You can optionally handle the response data if the backend returns any
      const responseData = await response.json();

      // Return the response data or perform any other necessary actions
      return responseData;
    } catch (error) {
      console.error("Error joining room:", error);
      // Handle the error as needed, e.g., show an error message to the user
      throw error; // You can re-throw the error to handle it at the component level
    }
  };
  const onJoinRoomHandler = async (event) => {
    event.preventDefault();
    const apiUrl = `http://localhost:8000/api/database/member-in-room/${id}/`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST", // You might need to adjust this depending on your API
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchMemberStatus(id, authToken);
    } catch (error) {
      console.error("Error joining room:", error);
      // Handle the error as needed, e.g., show an error message to the user
      throw error; // You can re-throw the error to handle it at the component level
    }
  };

  const onLeaveRoomHandler = async (event) => {
    event.preventDefault();
    const apiUrl = `http://localhost:8000/api/database/member-in-room/${id}/`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE", // You might need to adjust this depending on your API
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchMemberStatus(id, authToken);
    } catch (error) {
      console.error("Error joining room:", error);
      // Handle the error as needed, e.g., show an error message to the user
      throw error; // You can re-throw the error to handle it at the component level
    }
  };
  useEffect(() => {
    fetchRoomMessage(id, authToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchMemberStatus(id, authToken);
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
        <h3>{roomMetaContent.room_name && roomMetaContent.room_name.toUpperCase()}</h3>
      </Card>

      <Card className={classes.body}>
        <div className={classes.roomInfo}>
          <div className={classes["room-name"]}>
            {roomMetaContent.room_name}
          </div>

          {!memberStatus.is_host && (
            <div className={classes["button-group"]}>
              {memberStatus.is_member ? (
                <button
                  className={classes["btn__actions"]}
                  onClick={onLeaveRoomHandler}
                >
                  {"Leave"}
                </button>
              ) : (
                <button
                  className={classes["btn__actions"]}
                  onClick={onJoinRoomHandler}
                >
                  {"Join"}
                </button>
              )}
            </div>
          )}
          {memberStatus.is_host && (
            <div className={classes["button-group"]}>
              <button className={classes["btn__actions"]}>{"Delete"}</button>
              <button className={classes["btn__actions"]}>{"Edit"}</button>
            </div>
          )}
        </div>

        <div className={classes.description}>
          {roomMetaContent.created_ago} {"ago"}
        </div>
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
