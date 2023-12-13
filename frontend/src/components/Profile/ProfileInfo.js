import React, { useState, useEffect, useContext } from "react";
import classes from "./ProfileInfo.module.css";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import Avatar from "../UI/Avatar/Avatar";
import NeonButton from "../UI/Button/NeonButton";

const ProfileInfo = (props) => {
  //=============================== VARIABLE ================================
  //-------------------------------- API ------------------------------------
  const authToken = Cookies.get("authToken");
  const { id } = useParams();
  const ctx = useContext(AuthContext);
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //-------------------------------- Profile ------------------------------------
  const [profile, setProfile] = useState([]);
  const [followStatus, setFollowStatus] = useState([]);
  const navigate = useNavigate();

  //=============================== FUNCTIONS AND GETTING DATA ================================
  // redirect to change profile page
  const editProfileHandler = (event) => {
    event.preventDefault();
    navigate("/profile-setting");
  };

  // logout user
  const logoutHandler = (event) => {
    event.preventDefault();
    Cookies.remove("authToken");
    ctx.changeDisplayName(ctx.displayName + "_");
    navigate("/");
  };

  // Get the following status of other user (either auth user follow thier friend or not)
  async function fetchFollowStatus(id, authToken) {
    const apiUrl = `${backendUrl}/api/database/follow-status/${id}/`;

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

    const apiUrl = `${backendUrl}/api/database/follow-status/${id}/`;

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
        `${backendUrl}/api/database/follow-status/${id}/`,
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
    const apiUrl = `${backendUrl}/api/auth/user/${id}/`;

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
        <Avatar
          avatarLink={`/user/${profile.user}/`}
          avatarName={profile.avatar_name}
          imageClassName={classes["avatar-image"]}
          includeDisplayName={false}
        />
      </div>

      <div className={classes["display-name"]}>{profile.display_name}</div>
      <div className={classes["follower"]}>
        {profile.followers_count} Followers
      </div>

      {profile.is_auth_user && (
        <div className={classes["btn"]}>
          <NeonButton
            buttonText={"Edit Profile"}
            onClickHandler={editProfileHandler}
          ></NeonButton>

          <NeonButton
            buttonText={"Logout"}
            onClickHandler={logoutHandler}
          ></NeonButton>
        </div>
      )}

      {!profile.is_auth_user && (
        <div className={classes["btn"]}>
          {followStatus.followStatus ? (
            <NeonButton
              buttonText={"Unfollow"}
              onClickHandler={unfollowHandler}
            ></NeonButton>
          ) : (
            <NeonButton
              buttonText={"Follow"}
              onClickHandler={followHandler}
            ></NeonButton>
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
