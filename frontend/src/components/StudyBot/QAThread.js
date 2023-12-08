import React from "react";
import Card from "../UI/Card/Card";
import classes from "./QAThread.module.css";
import Avatar from "../UI/Avatar/Avatar";
import { FaRobot } from "react-icons/fa";
import { SiProbot } from "react-icons/si";
import { RiRobotFill } from "react-icons/ri";

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
        <div className={classes["message-content"]}>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "120%" }}>
            {props.message}
          </pre>
        </div>
      </Card>

      <br></br>
      <Card className={classes["body"]}>
        {(() => {
          switch (props.ai_model) {
            case "openAI":
              return (
                <div className={classes["study-bot"]}>
                  <FaRobot size={42} />
                  <h2 className={classes["bot-text"]}>Study Bot</h2>
                </div>
              );
            case "llama":
              return (
                <div className={classes["llama-bot"]}>
                  <SiProbot size={42} />
                  <h2 className={classes["llama-bot-text"]}>Experiment Bot</h2>
                </div>
              );
            case "mini_llama":
              return (
                <div className={classes["mini-bot"]}>
                  <RiRobotFill size={42} />
                  <h2 className={classes["mini-bot-text"]}>Mini Bot</h2>
                </div>
              );

            default:
              return (
                <div className={classes["study-bot"]}>
                  <FaRobot size={42} />
                  <h2 className={classes["bot-text"]}>Study Bot</h2>
                </div>
              );
          }
        })()}

        <div className={classes["message-content"]}>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "120%" }}>
            {props.response}
          </pre>
        </div>
      </Card>
    </React.Fragment>
  );
};

export default QAThread;
