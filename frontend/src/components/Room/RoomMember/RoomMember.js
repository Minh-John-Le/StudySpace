import React from "react";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import RoomMemberPagination from "./RoomMemberPagination";
import UserCard from "../../UI/User/UserCard";
import classes from "./RoomMember.module.css";
import Card from "../../UI/Card/Card";

const RoomMember = () => {
  const [data, setData] = useState([]); // all rooms
  const [maxPage, setMaxPage] = useState(1); // max page
  const [roomMetaContent, setRoomMetaContent] = useState([]);

  //--------------------------------- API--------------------------------------
  const authToken = Cookies.get("authToken");
  const { roomId } = useParams();
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //===================================== PREPARE TOPIC AND PAGE================================
  // Get the current location object
  const location = useLocation();

  // Parse the search parameters
  const searchParams = new URLSearchParams(location.search);

  let page = searchParams.get("page");

  if (page === null) {
    page = "1";
  }

  //===================================== GET DATA ================================
  // Url for room match topic and page
  const apiUrl = `${backendUrl}/api/database/all-member-in-room/${roomId}/?page=${page}`;

  useEffect(() => {
    async function fetchAllMemberHandler() {
      try {
        const headers = {
          Authorization: `Token ${authToken}`, // Include the authentication token
        };

        const response = await fetch(apiUrl, { headers });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const allMember = await response.json();
        setData(allMember.result);
        //console.log(data);

        setMaxPage(allMember.max_page);
        //console.log(allMember);
      } catch (error) {
        // Handle errors here, e.g., display an error message
        console.error("Error fetching data:", error);
      }
    }

    fetchAllMemberHandler();
  }, [page, apiUrl, authToken]);

  // Get the room info (meta info) for the first time
  useEffect(() => {
    async function fetchData() {
      const apiUrl = `${backendUrl}/api/database/room-manager/${roomId}/`;

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
  }, [authToken, roomId]);

  return (
    <React.Fragment>
      <Card className={classes["room-name-display"]}>
        <h2>{`Members in ${roomMetaContent.room_name}`}</h2>
      </Card>
      <div className={classes["user-card-group"]}>
        {data.map((data, index) => (
          <UserCard
            rank={index + 1}
            key={data.profile_id}
            profile_id={data.profile_id}
            avatar_name={data.avatar_name}
            display_name={data.display_name}
            follower_count={data.follower_count}
          />
        ))}
      </div>

      {data.length !== 0 && maxPage > 1 && (
        <RoomMemberPagination max_page={maxPage}></RoomMemberPagination>
      )}
    </React.Fragment>
  );
};

export default RoomMember;
