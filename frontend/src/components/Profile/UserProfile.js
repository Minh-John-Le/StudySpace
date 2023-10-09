import React, { useState, useEffect } from "react";

import classes from "./UserProfile.module.css";
import Button from "../UI/Button/Button";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const authToken = Cookies.get("authToken");
  const { id } = useParams();

  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = `http://localhost:8000/api/auth/user/${id}/`;

    async function fetchProfile() {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const profile = await response.json();
        setProfile(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    if (authToken) {
      fetchProfile(); // Call the function here if authToken is available
    }

    console.log(profile);
  }, [authToken, id]);

  const logoutHandler = () => {
    Cookies.remove("authToken");
    navigate("/");
  };

  return (
    <React.Fragment>
      <div className={classes["profile-info"]}>
        <div className={classes["profile-info__avatar-container"]}>
          <img
            src={profile.profile_image_url}
            alt="Avatar"
            className={classes["profile-info__avatar"]}
          />
        </div>
      </div>

      <div className={classes["display-name"]}>{profile.display_name}</div>
      <div className={classes["follower"]}> 0 Followers</div>

      {profile.is_auth_user && (
        <div className={classes["btn"]}>
          <button className={classes["btn__actions"]}>
            <div>{"Edit Profile"}</div>
          </button>

          <button className={classes["btn__actions"]} onClick={logoutHandler}>
            <div>{"Logout"}</div>
          </button>
        </div>
      )}

      {!profile.is_auth_user && (
        <div className={classes["btn"]}>
          <button className={classes["btn__actions"]}>
            <div>{"Follow"}</div>
          </button>
        </div>
      )}

      <div className={classes.subtitle}>ABOUT</div>
      <div className={classes.description}>{profile.bio}</div>
      <br></br>
      <div className={classes.subtitle}>
        STUDY ROOMS Minh Hung Le PARTICIPATES IN
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
