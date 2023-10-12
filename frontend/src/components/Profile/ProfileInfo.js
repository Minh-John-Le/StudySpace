import React, { useState, useEffect, useContext } from "react";
import classes from "./ProfileInfo.module.css";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";

const ProfileInfo = (props) => {
  //=============================== VARIABLE ================================
  const authToken = Cookies.get("authToken");
  const { id } = useParams();
  const ctx = useContext(AuthContext);

  const [profile, setProfile] = useState([]);
  const [followStatus, setFollowStatus] = useState([]);
  const navigate = useNavigate();

  //=============================== FUNCTIONS ================================
  const editProfileHandler = (event) => {
    event.preventDefault();
    navigate("/profile-setting");
  };

  const logoutHandler = (event) => {
    event.preventDefault();
    Cookies.remove("authToken");
    ctx.changeDisplayName("");
    navigate("/");
  };

  //=============================== GET DATA ================================
  // Get the following status of other user (either auth user follow thier friend or not)
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

  // Follow another user
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

  // Unfollow another user
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

  // Fetch follow status first time when page load
  useEffect(() => {
    fetchFollowStatus(id, authToken);
  }, [authToken, id]);

  // Get other User profile Info as well
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
      fetchProfile();
    }
  }, [authToken, id, followStatus]);

  //=============================== RETURN COMPONENTS ================================
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
      <div className={classes["follower"]}>
        {profile.followers_count} Followers
      </div>

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

export default ProfileInfo;