import React from "react";
import Card from "../UI/Card/Card";
import classes from "./QAThread.module.css";
import Avatar from "../UI/Avatar/Avatar";

const QAThread = (props) => {
  return (
    <React.Fragment>
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
        <div className={classes["message-content"]}>{props.message}</div>
      </Card>

      <br></br>
      <Card className={classes["body"]}>
        <div className={classes["writer-info"]}>
          <Avatar
            displayName={"Study Bot"}
            includeDisplayName={true}
            displayNameClassName={classes["avatar__display-name"]}
          />
        </div>
        <div className={classes["message-content"]}>
          <pre style={{ whiteSpace: "pre-wrap" }}>{props.response}</pre>
        </div>
      </Card>
    </React.Fragment>
  );
};

export default QAThread;
