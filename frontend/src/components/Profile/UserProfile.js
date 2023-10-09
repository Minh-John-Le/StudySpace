import React from "react";
import classes from "./UserProfile.module.css";
import Button from "../UI/Button/Button";

const UserProfile = () => {
  return (
    <React.Fragment>
      <div className={classes["profile-info"]}>
        <div className={classes["profile-info__avatar-container"]}>
          <img
            src={"https://placebear.com/250/250"}
            alt="Avatar"
            className={classes["profile-info__avatar"]}
          />
        </div>
      </div>

      <div className={classes["display-name"]}>Minh Hung Le</div>
      <div className={classes["follower"]}> 0 Followers</div>
      <div className={classes["btn"]}>
        <button className={classes["btn__actions"]}>
          <div>{"Edit Profile"}</div>
        </button>
        <button className={classes["btn__actions"]}>
          <div>{"Follow"}</div>
        </button>

        <button className={classes["btn__actions"]}>
          <div>{"Logout"}</div>
        </button>
      </div>
      <div>ABOUT</div>
      <div> Hello My namme is Little Chicken I love to Study Django</div>
      <div>STUDY ROOMS Minh Hung Le PARTICIPATES IN</div>
    </React.Fragment>
  );
};

export default UserProfile;
