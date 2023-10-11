import React from "react";
import Card from "../UI/Card/Card";
import classes from "./ConversationThread.module.css";
import { Link } from "react-router-dom";
const ConversationThread = (props) => {
  return (
    <Card className={classes["body"]}>
      <div className={classes["writer-info"]}>
        <Link to={`/user/${props.writer}`} className={classes.avatarLink}>
          <div className={classes.avatarContainer}>
            <img
              src={props.writer_image_url}
              alt="Avatar"
              className={classes.avatar}
            />
          </div>
          <span className={classes["avatarLink__display-name"]}>
            {props.writer_name}
          </span>
        </Link>
        <div className={classes["sent-date"]}>Sent {props.created_at}</div>
      </div>
      <div className={classes["message-content"]}>{props.content}</div>
    </Card>
  );
};

export default ConversationThread;
