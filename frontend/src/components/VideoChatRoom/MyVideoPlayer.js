// MyVideoPlayer.js
import React, { useEffect, useRef } from "react";
import Card from "../UI/Card/Card";
import classes from "./MyVideoPlayer.module.css";
import { useState } from "react";
import Cookies from "js-cookie";

const MyVideoPlayer = (props) => {
  const ref = useRef();
  const [profile, setProfile] = useState();

  //----------------------------- API ------------------------------------------------
  const authToken = Cookies.get("authToken");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    props.user.videoTrack.play(ref.current);
  }, []);

  useEffect(() => {
    const apiUrl = `${backendUrl}/api/auth/user/${props.id}/`;

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
        console.log(profile);
        setProfile(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    if (authToken) {
      fetchProfile();
    }
  }, [authToken]);

  return (
    <div>
      {profile && (
        <div className={classes.userName}>{profile.display_name}</div>
      )}
      <div className={classes.videoPlayer}>
        <div ref={ref} className={classes.videoContainer}></div>
      </div>
    </div>
  );
};

export default MyVideoPlayer;
