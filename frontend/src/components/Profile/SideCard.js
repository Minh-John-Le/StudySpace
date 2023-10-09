import React from "react";
import Card from "../UI/Card/Card";
import classes from "./SideCard.module.css";

import { Link } from "react-router-dom";
const SideCard = (props) => {
  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h3>{props.title}</h3>
      </Card>

      <Card className={classes.body}>
        <Link to={`/user/`} className={classes.avatarLink}>
          <div className={classes.avatarContainer}>
            <img
              src={"https://placebear.com/250/250"}
              alt="Avatar"
              className={classes.avatar}
            />
          </div>
          <span className={classes["avatarLink__display-name"]}>
            {"Minh Hung Le"}
          </span>
        </Link>

        <Link to={`/user/`} className={classes.avatarLink}>
          <div className={classes.avatarContainer}>
            <img
              src={"https://placebear.com/250/250"}
              alt="Avatar"
              className={classes.avatar}
            />
          </div>
          <span className={classes["avatarLink__display-name"]}>
            {"Minh Hung Le"}
          </span>
        </Link>
      </Card>
    </React.Fragment>
  );
};

export default SideCard;
