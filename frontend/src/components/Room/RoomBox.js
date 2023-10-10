import React from "react";
import Card from "../UI/Card/Card";
import classes from "./RoomBox.module.css";
import { Link } from "react-router-dom";
import ConversationBox from "./ConversationBox";

const RoomBox = (props) => {
  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h3>{"Java Best Room 123 "}</h3>
      </Card>

      <Card className={classes.body}>
        <div>{"Java Best Room 123 "}</div>
        <div> 100 days ago</div>
        <div>HOSTED BY</div>
        <Link to={`/user/1`} className={classes.avatarLink}>
          <div className={classes.avatarContainer}>
            <img
              src={"https://placekitten.com/640/360"}
              alt="Avatar"
              className={classes.avatar}
            />
          </div>
          <span className={classes["avatarLink__display-name"]}>
            {"Minh Hung Le"}
          </span>
        </Link>
        <div>
          <button className={classes["btn__actions"]}>
            <div>{"Join"}</div>
          </button>
        </div>
        <ConversationBox>
          
        </ConversationBox>
      </Card>
    </React.Fragment>
  );
};

export default RoomBox;
