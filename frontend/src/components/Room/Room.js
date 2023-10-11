import React, { useEffect, useState } from "react";
import RoomBox from "./RoomBox";
import ScrollableSideCard from "../UI/SideCard/ScrollableSideCard";
import classes from "./Room.module.css";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const Room = () => {
  const authToken = Cookies.get("authToken");
  const { id } = useParams();
  const [members, setMembers] = useState([]);
  const [memberStatus, setMemberStatus] = useState([]);

  async function fetchAllMemberInRoom(id, authToken) {
    const apiUrl = `http://localhost:8000/api/database/all-member-in-room/${id}/`;

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

  useEffect(() => {
    fetchAllMemberInRoom(id, authToken);
  }, [id, authToken, memberStatus]);

  return (
    <div className={classes["room-container"]}>
      <div className={classes["room-box"]}>
        <RoomBox changeMemberStatus={setMemberStatus}></RoomBox>
      </div>
      <div className={classes["side-card"]}>
        <ScrollableSideCard
          title={"MEMBERS"}
          data={members}
        ></ScrollableSideCard>
      </div>
    </div>
  );
};

export default Room;
