import React, { useState, useEffect } from "react";

import classes from "./UserProfile.module.css";
import Button from "../UI/Button/Button";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";

const UserProfile = (props) => {
  const authToken = Cookies.get("authToken");
  const { id } = useParams();

  const [profile, setProfile] = useState([]);
  const [followStatus, setFollowStatus] = useState([]);
  const navigate = useNavigate();

  const editProfileHandler = (event) => {
    event.preventDefault();
    navigate("/profile-setting");
  };

  async function fetchFollowStatus(id, authToken) {
    const apiUrl = `http://localhost:8000/api/database/follow-status/${id}/`;

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

      const followStatusRs = await response.json();
      setFollowStatus(followStatusRs);
      props.changeFollowStatus(followStatusRs);
    } catch (error) {
      console.error("Error fetching follow status:", error);
    }
  }

  const followHandler = async (event) => {
    event.preventDefault();

    const apiUrl = `http://localhost:8000/api/database/follow-status/${id}/`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Assuming you want to update the followStatus in your component state,
      // you can call the fetchFollowStatus function again to update it.

      fetchFollowStatus(id, authToken);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const unfollowHandler = async (event) => {
    event.preventDefault();

    // Send a DELETE request to the API to unfollow the user
    try {
      const response = await fetch(
        `http://localhost:8000/api/database/follow-status/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchFollowStatus(id, authToken);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  useEffect(() => {
    fetchFollowStatus(id, authToken);
  }, [authToken, id]);

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
  }, [authToken, id]);

  const logoutHandler = (event) => {
    event.preventDefault();
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
          <button
            className={classes["btn__actions"]}
            onClick={editProfileHandler}
          >
            <div>{"Edit Profile"}</div>
          </button>

          <button className={classes["btn__actions"]} onClick={logoutHandler}>
            <div>{"Logout"}</div>
          </button>
        </div>
      )}

      {!profile.is_auth_user && (
        <div className={classes["btn"]}>
          {followStatus.followStatus ? (
            <button
              className={classes["btn__actions"]}
              onClick={unfollowHandler}
            >
              <div>{"Unfollow"}</div>
            </button>
          ) : (
            <button className={classes["btn__actions"]} onClick={followHandler}>
              <div>{"Follow"}</div>
            </button>
          )}
        </div>
      )}

      <div className={classes.subtitle}>ABOUT</div>
      <div className={classes.description}>{profile.bio}</div>
      <br></br>
      <div className={classes.subtitle}>
        STUDY ROOMS {profile.display_name} PARTICIPATES IN
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
