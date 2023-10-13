import React from "react";
import Card from "../Card/Card";
import ScrollableCard from "../Card/ScrollableCard";
import classes from "./ScrollableSideCard.module.css";

import { Link } from "react-router-dom";
const ScrollableSideCard = (props) => {
  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h3>{props.title}</h3>
      </Card>

      <ScrollableCard className={classes.body}>
        {props.data &&
          props.data.map((user, index) => (
            <Link
              key={user.profile_id}
              to={`/user/${user.profile_id}`}
              className={classes.avatarLink}
            >
              <div className={classes.avatarContainer}>
                <img
                  src={user.profile_image_url}
                  alt="Avatar"
                  className={classes.avatar}
                />
              </div>
              <span className={classes["avatarLink__display-name"]}>
                {user.display_name}
              </span>
            </Link>
          ))}
      </ScrollableCard>
    </React.Fragment>
  );
};

export default ScrollableSideCard;
