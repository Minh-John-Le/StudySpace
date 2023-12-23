import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import VideoChatRoomCard from "./VideoChatRoomCard";

const VideoChatRoomCardList = () => {
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

  return (
    <div>
      {roomList.map((room) => (
        <VideoChatRoomCard
          key={room.id}
          id={room.id}
          host={room.host_display_name}
          host_avatar_name={room.host_avatar_name}
          host_id={room.host}
          created_ago={room.created_ago}
          room_name={room.room_name}
          is_host={room.is_host}
          invitation_uuid={room.invitation_uuid}
          remaining_duration={room.remaining_duration}
        />
      ))}
    </div>
  );
};

export default VideoChatRoomCardList;
