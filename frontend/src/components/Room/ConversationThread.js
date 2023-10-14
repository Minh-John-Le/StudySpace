import React from "react";
import Card from "../UI/Card/Card";
import classes from "./ConversationThread.module.css";
import { Link } from "react-router-dom";
import Avatar from "../UI/Avatar/Avatar";
const ConversationThread = (props) => {
  return (
    <Card className={classes["body"]}>
      <div className={classes["writer-info"]}>
        <Avatar
          avatarLink={`/user/${props.writer}`}
          displayName={props.writer_name}
          avatarName={props.writer_avatar_name}
          includeDisplayName={true}
          displayNameClassName={classes["avatar__display-name"]}
        />
        <div className={classes["sent-date"]}>Sent {props.created_at}</div>
      </div>
      <div className={classes["message-content"]}>{props.content}</div>
    </Card>
  );
};

export default ConversationThread;
