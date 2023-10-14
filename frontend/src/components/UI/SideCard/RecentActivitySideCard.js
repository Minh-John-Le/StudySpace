import React from "react";
import Card from "../Card/Card";
import ScrollableCard from "../Card/ScrollableCard";
import classes from "./RecentActivitySideCard.module.css";

import { Link } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
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
                <Avatar
                  avatarLink={`/user/${message.writer}`}
                  avatarName={message.writer_avatar_name}
                  displayName={message.writer_name}
                  includeDisplayName={true}
                  displayNameClassName={classes["avatar__display-name"]}
                />
              </div>
              <div className={classes["sent-date"]}>
                {message.created_ago} {"ago"}
              </div>

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
