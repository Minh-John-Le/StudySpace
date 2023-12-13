import React, { useEffect, useState } from "react";
import Card from "../UI/Card/Card";
import classes from "./RoomBox.module.css";
import { useNavigate } from "react-router-dom";
import ConversationBox from "./ConversationBox";
import MessageForm from "./MessageForm";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Avatar from "../UI/Avatar/Avatar";
import Pusher from "pusher-js";

import { BsFillPersonCheckFill } from "react-icons/bs";
import { MdPersonOff } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { TiDelete } from "react-icons/ti";

import IconButton from "../UI/Button/IconButton";

const RoomBox = (props) => {
  //================================ VARIABLEs ==============================
  //--------------------------------------- Room Info -----------------------------
  const [messages, setMessages] = useState([]);
  const [roomMetaContent, setRoomMetaContent] = useState([]);
  const [memberStatus, setMemberStatus] = useState([]);

  //--------------------------------------- API ------------------------------------
  const authToken = Cookies.get("authToken");
  const { id } = useParams();
  const navigate = useNavigate();
  // const wsURL = process.env.REACT_APP_WEBSOCKET_URL;
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const pusherKey = process.env.REACT_APP_PUSHER_KEY;

  //================================ FUNCTIONS ==============================
  // Get Room Message
  // const handleWebSocketMessage = (event) => {
  //   const newMessage = JSON.parse(event.data);
  //   const message_data = newMessage.message_data;

  //   // Format the created_at field before adding it to the state
  //   const formattedMessage = {
  //     ...message_data,
  //     created_at: formatCreatedAt(message_data.created_at),
  //   };

  //   // Assuming the WebSocket server sends messages as JSON objects
  //   setMessages((prevMessages) => [formattedMessage, ...prevMessages]);
  // };

  // useEffect(() => {
  //   const socket = new WebSocket(`${wsURL}/ws/room/${id}/`);

  //   socket.onmessage = (event) => {
  //     handleWebSocketMessage(event);
  //   };

  //   return () => {
  //     // Close the WebSocket connection when the component unmounts
  //     socket.close();
  //   };
  // }, [id]);

  useEffect(() => {
    const pusher = new Pusher(`${pusherKey}`, {
      cluster: "us3",
    });

    const channel = pusher.subscribe(`${id}`);
    channel.bind("send-message", function (message) {
      const message_data = message.data;
      console.log(message_data);
      const formattedMessage = {
        ...message_data,
        created_at: formatCreatedAt(message_data.created_at),
      };
      // Assuming the WebSocket server sends messages as JSON objects
      setMessages((prevMessages) => [formattedMessage, ...prevMessages]);
    });

    // Clean up the subscription when the component unmounts
    return () => {
      channel.unbind("send-message");
      pusher.unsubscribe(`${id}`);
    };
  }, [id]);

  async function fetchRoomMessage(id, authToken) {
    const apiUrl = `${backendUrl}/api/chat/room-message/${id}/`;

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
    const apiUrl = `${backendUrl}/api/database/member-in-room/${id}/`;

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

    // Set the time zone to 'GMT+7'
    const options = {
      timeZone: 'Etc/GMT+7',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
  
    // Use toLocaleString with the specified time zone options
    const formattedDate = date.toLocaleString('en-US', options);
    return formattedDate;
  }

  // Function handle join room
  const onJoinRoomHandler = async (event) => {
    event.preventDefault();
    const apiUrl = `${backendUrl}/api/database/member-in-room/${id}/`;

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
        `${backendUrl}/api/database/room-manager/${id}/`,
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
    const apiUrl = `${backendUrl}/api/database/member-in-room/${id}/`;

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
      const apiUrl = `${backendUrl}/api/database/room-manager/${id}/`;

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

          {/*=========== NORMAL MEMBER JOIN/LEAVE ROOM ================= */}
          {!memberStatus.is_host && (
            <div className={classes["alt-button-group"]}>
              {memberStatus.is_member ? (
                <IconButton
                  icon={BsFillPersonCheckFill}
                  onClickHandler={onLeaveRoomHandler}
                />
              ) : (
                <IconButton
                  icon={MdPersonOff}
                  onClickHandler={onJoinRoomHandler}
                />
              )}
            </div>
          )}

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

          {/*=========== HOST EDIT/DELETE ROOM ================= */}
          {memberStatus.is_host && (
            <div className={classes["alt-button-group"]}>
              <IconButton
                icon={MdModeEdit}
                onClickHandler={onEditRoomHandler}
              />
              <IconButton
                icon={TiDelete}
                onClickHandler={onDeleteRoomHandler}
              />
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
        <Avatar
          displayName={roomMetaContent.host_display_name}
          avatarName={roomMetaContent.host_avatar_name}
          avatarLink={`/user/${roomMetaContent.host}`}
          includeDisplayName={true}
          displayNameClassName={classes["avatar__display-name"]}
          avatarLinkClassName={classes["avatar__link"]}
        />

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
