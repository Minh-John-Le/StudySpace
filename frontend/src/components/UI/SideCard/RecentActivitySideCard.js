import React from "react";
import Card from "../Card/Card";
import ScrollableCard from "../Card/ScrollableCard";
import classes from "./RecentActivitySideCard.module.css";

import { Link } from "react-router-dom";
const RecentActivitySideCard = (props) => {
  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h3>{props.title}</h3>
      </Card>

      <ScrollableCard className={classes.body}>
        {props.data &&
          props.data.map((message, index) => (
            <Card className={classes["inner-body"]}>
              <div className={classes["writer-info"]}>
                <Link
                  to={`/user/${message.writer}`}
                  className={classes.avatarLink}
                >
                  <div className={classes.avatarContainer}>
                    <img
                      src={message.writer_image_url}
                      alt="Avatar"
                      className={classes.avatar}
                    />
                  </div>
                  <span className={classes["avatarLink__display-name"]}>
                    {message.writer_name}
                  </span>
                </Link>
              </div>
              <div className={classes["sent-date"]}>{message.created_ago}</div>

              <div className={classes["sent-date"]}>
                {`Replied to post "`}
                <Link
                  to={`/room/${message.room}`}
                  className={classes["room-link"]}
                >
                  {message.room_name}
                </Link>
                {`"`}
              </div>

              <Card className={classes["message-card"]}>
                <div>{message.content}</div>
              </Card>
            </Card>
          ))}
      </ScrollableCard>
    </React.Fragment>
  );
};

export default RecentActivitySideCard;
