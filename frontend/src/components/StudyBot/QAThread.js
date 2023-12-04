import React from "react";
import Card from "../UI/Card/Card";
import classes from "./QAThread.module.css";
import Avatar from "../UI/Avatar/Avatar";

const QAThread = (props) => {
  return (
    <Card className={classes["body"]}>
      <div className={classes["writer-info"]}>
        <Avatar
          avatarLink={`/user/1/`}
          displayName={"You"}
          avatarName={"ABC"}
          includeDisplayName={true}
          displayNameClassName={classes["avatar__display-name"]}
        />
        <div className={classes["sent-date"]}>Sent {"asdasdasdad"}</div>
      </div>
      <div className={classes["message-content"]}>{props.content}</div>
    </Card>
  );
};

export default QAThread;
