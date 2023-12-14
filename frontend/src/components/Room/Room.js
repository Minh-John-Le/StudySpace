import React, { useEffect, useState } from "react";
import RoomBox from "./RoomBox";
import ScrollableSideCard from "../UI/SideCard/ScrollableSideCard";
import classes from "./Room.module.css";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import AuthenticateChecker from "../Home/AuthenticateChecker";

const Room = () => {
  //========================= VARIABLE ==================================
  //---------------------------- Membership data -----------------------------------
  const [members, setMembers] = useState([]);
  const [memberStatus, setMemberStatus] = useState([]);

  //---------------------------- API -----------------------------------
  const authToken = Cookies.get("authToken");
  const { id } = useParams();
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //========================= FUNCTIONS ==================================
  // Get member list of the room
  async function fetchAllMemberInRoom(id, authToken) {
    const apiUrl = `${backendUrl}/api/database/some-member-in-room/${id}/`;

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

      setMembers(data);

      // Format the created_at property for each message
    } catch (error) {
      console.error("Error fetching all members in room:", error);
    }
  }

  // Get member list of the room when page load, leave or join room
  useEffect(() => {
    fetchAllMemberInRoom(id, authToken);
  }, [id, authToken, memberStatus]);

  //========================= RETURN COMPONENTS ==================================
  return (
    <div className={classes["room-container"]}>
      <AuthenticateChecker></AuthenticateChecker>
      <div className={classes["room-box"]}>
        <RoomBox changeMemberStatus={setMemberStatus}></RoomBox>
      </div>
      <div className={classes["side-card"]}>
        <ScrollableSideCard
          key={"memberCard"}
          title={"MEMBERS"}
          hasTitleLink={true}
          titleLink={`/room-member/${id}`}
          data={members}
        ></ScrollableSideCard>
      </div>
    </div>
  );
};

export default Room;
