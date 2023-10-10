import React from "react";
import Card from "../Card/Card";
import classes from "./SideCard.module.css";

import { Link } from "react-router-dom";
const SideCard = (props) => {
  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h3>{props.title}</h3>
      </Card>

      <Card className={classes.body}>
        {props.data &&
          props.data.map((user, index) => (
            <Link
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
      </Card>
    </React.Fragment>
  );
};

export default SideCard;
