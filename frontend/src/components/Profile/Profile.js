import React, { useState, useEffect } from "react";
import UserProfile from "./UserProfile";
import classes from "./Profile.module.css";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import ScrollableSideCard from "../UI/SideCard/ScrollableSideCard";

const Profile = () => {
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followStatus, setFollowStatus] = useState([]);

  const authToken = Cookies.get("authToken");
  const { id } = useParams();

  useEffect(() => {
    const apiUrl = `http://localhost:8000/api/database/follower/${id}/`;

    async function fetchFollower() {
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

        const followerList = await response.json();
        setFollower(followerList);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    if (authToken) {
      fetchFollower(); // Call the function here if authToken is available
    }
  }, [authToken, id, followStatus]);

  useEffect(() => {
    const apiUrl = `http://localhost:8000/api/database/following/${id}/`;

    async function fetchFollower() {
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

        const followingList = await response.json();
        setFollowing(followingList);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    if (authToken) {
      fetchFollower(); // Call the function here if authToken is available
    }
  }, [authToken, id]);

  return (
    <div className={classes["profile-container"]}>
      <div className={classes["side-card"]}>
        <ScrollableSideCard title={"FOLLOWERS"} data={follower} />
      </div>
      <div className={classes["user-profile"]}>
        <UserProfile changeFollowStatus={setFollowStatus} />
      </div>
      <div className={classes["side-card"]}>
        <ScrollableSideCard title={"FOLLOWING"} data={following} />
      </div>
    </div>
  );
};

export default Profile;
