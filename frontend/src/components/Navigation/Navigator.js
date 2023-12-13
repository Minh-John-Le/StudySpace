import React from "react";
import classes from "./navigator.module.css";
import { AiOutlineHome } from "react-icons/ai";
import { RiRobot2Line } from "react-icons/ri";

import { Link } from "react-router-dom";
const Navigator = () => {
  return (
    <div className={classes["navigator-display"]}>
      <div className={classes["navigator"]}>
        <Link to="/" className={classes["navigator-link"]}>
          <AiOutlineHome className={classes["navigator-icon"]} />
        </Link>
        <Link to="/studybot" className={classes["navigator-link"]}>
          <RiRobot2Line className={classes["navigator-icon"]} />
        </Link>
      </div>
    </div>
  );
};

export default Navigator;
