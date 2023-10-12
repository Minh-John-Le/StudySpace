import React, { useEffect, useState } from "react";
import Card from "../UI/Card/Card";
import classes from "./RoomBox.module.css";
import { Link, useNavigate } from "react-router-dom";
import ConversationBox from "./ConversationBox";
import MessageForm from "./MessageForm";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const RoomBox = (props) => {
  //================================ VARIABLEs ==============================
  const [messages, setMessages] = useState([]);
  const [roomMetaContent, setRoomMetaContent] = useState([]);
  const [memberStatus, setMemberStatus] = useState([]);
  const authToken = Cookies.get("authToken");
  const { id } = useParams();
  const navigate = useNavigate();

  //================================ FUNCTIONS ==============================
  // Get Room Message
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

  // Get the member status such as join or not join the room
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

  // Reformat Message Time
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

  // Function handle join room
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

  // Function handle delete room
  const onDeleteRoomHandler = async (event) => {
    event.preventDefault();
    try {
      // Send a PATCH request to your backend login endpoint
      const response = await fetch(
        `http://localhost:8000/api/database/room-manager/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      navigate(`/`);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Function handle edit room
  const onEditRoomHandler = (event) => {
    event.preventDefault();
    navigate(`/update-room/${id}`);
  };

  // Function handle leave room
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

  // Get the room message and join status for the first time
  useEffect(() => {
    fetchRoomMessage(id, authToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchMemberStatus(id, authToken);
  }, [authToken, id]);

  // Get the room info (meta info) for the first time
  useEffect(() => {
    async function fetchData() {
      const apiUrl = `http://localhost:8000/api/database/room-manager/${id}/`;

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

  //================================ RETURN COMPONENTS ==============================
  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h3>
          {roomMetaContent.room_name && roomMetaContent.room_name.toUpperCase()}
        </h3>
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
              <button
                className={classes["btn__actions"]}
                onClick={onEditRoomHandler}
              >
                {"Edit"}
              </button>
              <button
                className={classes["btn__actions"]}
                onClick={onDeleteRoomHandler}
              >
                {"Delete"}
              </button>
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
        <div className={classes.subtitle}>ROOM INFO</div>
        <div className={classes.description}>{roomMetaContent.description}</div>
        <div className={classes["room-note"]}>
          NOTE: Room will only display 100 most recent messages while this
          website is still in beta.
        </div>
        <ConversationBox messages={messages}></ConversationBox>
        <MessageForm fetchRoomMessage={fetchRoomMessage}></MessageForm>
      </Card>
    </React.Fragment>
  );
};

export default RoomBox;
