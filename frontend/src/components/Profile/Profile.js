import React from "react";
import UserProfile from "./UserProfile";
import SideCard from "./SideCard";
import classes from "./Profile.module.css";

const Profile = () => {
  return (
    <div className={classes["profile-container"]}>
      <div className={classes["side-card"]}>
        <SideCard title ={"FOLLOWERS"}/>
      </div>
      <div className={classes["user-profile"]}>
        <UserProfile/>
      </div>
      <div className={classes["side-card"]}>
        <SideCard title ={"FOLLOWING"}/>
      </div>
    </div>
  );
};

export default Profile;
