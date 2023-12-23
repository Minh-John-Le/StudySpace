import React from "react";

import UserLink from "./UserLink";
import classes from "./MainHeader.module.css";
import { SiStarship } from "react-icons/si";
import { Link } from "react-router-dom";

const MainHeader = (props) => {
  return (
    <header className={classes["main-header"]}>
      <div className={classes["header-content"]}>
        <Link to={"/"} className={classes["main-header__home-link"]}>
          <span>
            <SiStarship size={36} />
          </span>
          <h2>Study Space</h2>
        </Link>

        <div className={classes["sub-link"]}>
          <Link to={"/"}>
            <span>Chat Room</span>
          </Link>
          <Link to={"/studybot"}>
            <span>Study Bot</span>
          </Link>
          <Link to={"/video-chat"}>
            <span>Video Call</span>
          </Link>
        </div>
        <div className={classes["header-user-link"]}>
          <UserLink />
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
