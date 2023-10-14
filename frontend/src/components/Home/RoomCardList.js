import React, { useState, useEffect } from "react";
import RoomCard from "../UI/RoomCard/RoomCard";
import { useLocation } from "react-router-dom";
import Card from "../UI/Card/Card";
import classes from "./RoomCardList.module.css";
import RoomPagination from "./RoomPagination";

const RoomCardList = () => {
  //===================================== PREPARE VARIABLE================================

  const [data, setData] = useState([]); // all rooms
  const [maxPage, setMaxPage] = useState(1); // max page

  //===================================== PREPARE TOPIC AND PAGE================================
  // Get the current location object
  const location = useLocation();

  // Parse the search parameters
  const searchParams = new URLSearchParams(location.search);

  let topic = searchParams.get("topic");
  if (topic === null) {
    topic = "";
  }

  let page = searchParams.get("page");

  if (page === null) {
    page = "1";
  }

  //===================================== GET DATA ================================
  // Url for room match topic and page
  const apiUrl = `http://localhost:8000/api/database/room-card/?topic=${topic}&page=${page}`;

  // Get new room data whenever topic or page change
  useEffect(() => {
    async function fetchRoomHandler() {
      const respond = await fetch(apiUrl);
      const room = await respond.json();
      setData(room.result);
      setMaxPage(room.max_page);
    }

    fetchRoomHandler();
  }, [topic, page, apiUrl]);

  //===================================== RETURN COMPONENT ================================
  return (
    <React.Fragment>
      {data.length === 0 && (
        <div>
          <Card className={classes["roomcard"]}>
            <h2>Opps there is no room!!</h2>
          </Card>
        </div>
      )}
      <div>
        {data.map((room, index) => (
          <RoomCard
            key={room.room_data.id}
            room_id={room.room_data.id}
            host_id={room.room_data.host}
            host={room.room_data["host_display_name"]}
            host_avatar_name={room.room_data.host_avatar_name}
            totalMember={room.room_data.total_member}
            room_name={room.room_data.room_name}
            topic={room.room_data.topic}
            created_ago={room.room_data.created_ago}
            members={room.members}
          />
        ))}
      </div>

      {data.length !== 0 && (
        <RoomPagination max_page={maxPage}></RoomPagination>
      )}
    </React.Fragment>
  );
};

export default RoomCardList;
