import React from "react";
import Card from "../Card/Card";
import { Link } from "react-router-dom";
import classes from "./RoomCard.module.css";
import { TbUsers } from "react-icons/tb";

const RoomCard = (props) => {
  return (
    <Card className={classes["roomcard"]}>
      <div className={classes["roomcard-header"]}>
        <div className={classes["roomcard-header-left"]}>
          <Link
            key={`user_${props.host_id}`}
            to={"/user/" + props.host_id}
            className={classes.roomcard__avatarLink}
          >
            <div className={classes["roomcard__avatar-container"]}>
              <img
                src={props.host_image_url}
                alt="Avatar"
                className={classes["roomcard__avatar-container__img"]}
              />
              <span
                to={"/user/" + props.host_id}
                className={classes["roomcard__avatar-container__link"]}
              >
                Host @{props.host}
              </span>
            </div>
          </Link>
        </div>
        <div className={classes["roomcard-header-right"]}>
          <span>{props.created_ago} ago</span>
        </div>
      </div>
      <div>
        <Link
          key={`room_${props.host_id}`}
          to={"/room/" + props.room_id}
          className={classes["roomcard__room-link"]}
        >
          <h2>{props.room_name}</h2>
        </Link>
      </div>
      <div className={classes["roomcard_room-member"]}>
        {props.members.map((member, index) => (
          <Link
            key={`member_${props.host_id}`}
            to={"/user/" + member.profile_id}
            className={classes["roomcard__member-avatarLink"]}
          >
            <div className={classes["roomcard__avatar-container"]}>
              <img
                src={member.profile_image_url}
                alt="Avatar"
                className={classes["roomcard__avatar-container__img"]}
              />
            </div>
          </Link>
        ))}
      </div>
      <div className={classes["roomcard__meta"]}>
        <p className={classes["roomcard__member"]}>
          <TbUsers className={classes["roomcard__member-icon"]}></TbUsers>
          {props.totalMember} Joined
        </p>
        <p className={classes["roomcard__topic"]}>{props.topic}</p>
      </div>
    </Card>
  );
};

export default RoomCard;
