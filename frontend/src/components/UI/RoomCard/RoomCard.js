import React from "react";
import Card from "../Card/Card";
import { Link } from "react-router-dom";
import classes from "./RoomCard.module.css";
import { TbUsers } from "react-icons/tb";
import Avatar from "../Avatar/Avatar";

const RoomCard = (props) => {
  return (
    <Card className={classes["roomcard"]}>
      <div className={classes["roomcard-header"]}>
        <div className={classes["roomcard-header-left"]}>
          <Avatar
            displayName={`Host @${props.host}`}
            avatarName={props.host_avatar_name}
            avatarLink={"/user/" + props.host_id}
            includeDisplayName={true}
            displayNameClassName={classes["avatar__display-name"]}
            avatarLinkClassName={classes["avatar__link"]}
          />
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
          <Avatar
            key={`member_${member.profile_id}`}
            avatarName={member.avatar_name}
            avatarLink={"/user/" + member.profile_id}
            includeDisplayName={false}
            displayNameClassName={classes["avatar__display-name"]}
            avatarLinkClassName={classes["avatar__link"]}
          />
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
