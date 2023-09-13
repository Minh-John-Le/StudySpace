import React from "react";
import Card from "../UI/Card/Card";
import { Link } from "react-router-dom";
import classes from "./RoomCard.module.css";

const RoomCard = (props) => {
  return (
    <Card className={classes["room-card"]}>
      <Link to="/" className={classes.avatarLink}>
        <div className={classes.avatarContainer}>
          <img
            src="https://placebear.com/250/250"
            alt="Avatar"
            className={classes.avatar}
          />
        </div>
        <span>Host@{props.host}</span>
      </Link>
      <Link to="/1">
        <h2>{props.title}</h2>
      </Link>
    
      <div>{props.totalMember} Joined</div>
      <div>{props.topic}</div>
    </Card>
  );
};

export default RoomCard;
