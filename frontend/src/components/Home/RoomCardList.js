import React, { useState, useEffect } from "react";
import RoomCard from "./RoomCard";
import { useLocation } from "react-router-dom";

const RoomCardList = () => {
  const [data, setData] = useState([]);
  // Get the current location object
  const location = useLocation();

  // Parse the search parameters
  const searchParams = new URLSearchParams(location.search);

  // Extract the 'topic' parameter value
  let topic = searchParams.get("topic");
  if (topic === null) {
    topic = "";
  }

  let page = searchParams.get("page");

  if (page === null) {
    page = "1";
  }

  const apiUrl =
    "http://localhost:8000/api/database/room-card/?topic=" +
    topic.toString() +
    "&?page=" +
    page.toString();

  useEffect(() => {
    async function fetchRoomHandler() {
      const respond = await fetch(apiUrl);
      const room = await respond.json();
      setData(room);
    }

    fetchRoomHandler(); // Call the function here
  }, [topic, page]); // Include all dependencies in the array

  return (
    <div>
      {data.map((room, index) => (
        <RoomCard
          key={room.id}
          room_id={room.id}
          host_id={room.host}
          host={room["host_display_name"]}
          totalMember={room.total_member}
          description={room.description}
          topic={room.topic}
        />
      ))}
    </div>
  );
};

export default RoomCardList;
