import React, { useState, useEffect } from "react";
import JoinRoomForm from "./JoinRoomForm";
import VideoChatRoomCardList from "./VideoChatRoomCardList";
import Cookies from "js-cookie";

const VideoChat = () => {
  const [roomList, setRoomList] = useState([]);

  //----------------------------------- API ----------------------------------
  const authToken = Cookies.get("authToken");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchRoomList = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/videochat/videochat-room-list/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${authToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          //console.log(data);
          setRoomList(data);
        } else {
          // Handle errors, e.g., show an error message to the user
          console.error("Error fetching room list:", response.statusText);
        }
      } catch (error) {
        // Handle unexpected errors
        console.error("Unexpected error:", error);
      }
    };

    fetchRoomList();
  }, []);

  const deleteRoomById = (roomId) => {
    setRoomList((prevRoomList) =>
      prevRoomList.filter((room) => room.id !== roomId)
    );
  };

  const addNewRoom = (newRoom) => {
    setRoomList((prevRoomList) => [newRoom, ...prevRoomList]);
  };

  return (
    <div>
      <JoinRoomForm addNewRoom={addNewRoom}></JoinRoomForm>
      <VideoChatRoomCardList
        deleteRoomById={deleteRoomById}
        roomList={roomList}
      ></VideoChatRoomCardList>
    </div>
  );
};

export default VideoChat;
