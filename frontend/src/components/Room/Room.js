import React from "react";
import RoomBox from "./RoomBox";
import SideCard from "../Profile/SideCard";
import classes from "./Room.module.css";

const Room = () => {
  return (
    <div className={classes["room-container"]}>
      <div className={classes["room-box"]}>
        <RoomBox></RoomBox>
      </div>
      <div className={classes["side-card"]}>
        <SideCard title={"MEMBERS"}></SideCard>
      </div>
    </div>
  );
};

export default Room;
