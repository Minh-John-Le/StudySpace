import React, { useState, useEffect } from "react";
import RoomCard from "../UI/RoomCard/RoomCard";
import { useLocation } from "react-router-dom";
import Card from "../UI/Card/Card";
import classes from "./ProfileRoomCardList.module.css";
import ProfileRoomPagination from "./ProfileRoomPagination";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const ProfileRoomCardList = () => {
  //===================================== PREPARE VARIABLE================================
  //--------------------------------- Pagination ---------------------------------
  const [data, setData] = useState([]); // all rooms
  const [maxPage, setMaxPage] = useState(1); // max page

  //--------------------------------- API--------------------------------------
  const authToken = Cookies.get("authToken");
  const { id } = useParams();
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

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
  const apiUrl = `${backendUrl}/api/database/user-room/${id}/?topic=${topic}&page=${page}`;

  useEffect(() => {
    async function fetchRoomHandler() {
      try {
        const headers = {
          Authorization: `Token ${authToken}`, // Include the authentication token
        };

        const response = await fetch(apiUrl, { headers });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const room = await response.json();
        setData(room.result);
        setMaxPage(room.max_page);
      } catch (error) {
        // Handle errors here, e.g., display an error message
        console.error("Error fetching data:", error);
      }
    }

    fetchRoomHandler();
  }, [topic, page, apiUrl, authToken]);

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
        <ProfileRoomPagination max_page={maxPage}></ProfileRoomPagination>
      )}
    </React.Fragment>
  );
};

export default ProfileRoomCardList;
