import React, { useState, useEffect } from "react";
import UserProfile from "./UserProfile";
import classes from "./Profile.module.css";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import ScrollableSideCard from "../UI/SideCard/ScrollableSideCard";
import RecentActivitySideCard from "../UI/SideCard/RecentActivitySideCard";

const Profile = () => {
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followStatus, setFollowStatus] = useState([]);
  const [recentMessage, setRecentMessage] = useState([]);

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

  useEffect(() => {
    const apiUrl = `http://localhost:8000/api/database/recent-message/${id}/`;

    async function fetchRecentMessage() {
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

        const data = await response.json();
        setRecentMessage(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    if (authToken) {
      fetchRecentMessage();
    }
  }, [authToken, id]);

  return (
    <div className={classes["profile-container"]}>
      <div className={classes["side-card"]}>
        <ScrollableSideCard title={"FOLLOWERS"} data={follower} />
        <br></br>
        <ScrollableSideCard title={"FOLLOWING"} data={following} />
      </div>
      <div className={classes["user-profile"]}>
        <UserProfile changeFollowStatus={setFollowStatus} />
      </div>
      <div className={classes["side-card"]}>
        <RecentActivitySideCard
          title={"RECENT POSTS"}
          data={recentMessage}
        ></RecentActivitySideCard>
      </div>
    </div>
  );
};

export default Profile;
