import React from "react";
import Card from "../UI/Card/Card";
import classes from "./QAThread.module.css";
import Avatar from "../UI/Avatar/Avatar";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";

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
        <div></div>
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
        <div className={classes["message-content"]}>{props.response}</div>
        <div></div>
      </Card>
    </React.Fragment>
  );
};

export default QAThread;
