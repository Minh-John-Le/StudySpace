import React, { useState, useEffect } from "react";

import classes from "./Navigation.module.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const Navigation = (props) => {
  //=============================== VARIABLE =======================================
  const [profile, setProfile] = useState([]);
  const authToken = Cookies.get("authToken");

  //=============================== GET DATA =======================================
  // get user profile info if user is already log in
  useEffect(() => {
    const apiUrl = `http://localhost:8000/api/auth/profile/`;

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

        const profileRS = await response.json();
        setProfile(profileRS);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    if (authToken) {
      fetchProfile();
    }
  }, [authToken]);

  //=============================== RETURN COMPONENT ===============================
  return (
    <nav className={classes.nav}>
      <ul>
        {!authToken && (
          <li>
            <Link to="/login/" className={classes.avatarLink}>
              <div className={classes.avatarContainer}>
                <img
                  src="https://placebear.com/250/250"
                  alt="Avatar"
                  className={classes.avatar}
                />
              </div>
              <span className={classes["roomcard__avatar-container__link"]}>
                {"Login"}
              </span>
            </Link>
          </li>
        )}

        {authToken && (
          <li>
            <Link to={`/user/${profile.user}/`} className={classes.avatarLink}>
              <div className={classes.avatarContainer}>
                <img
                  src={profile.profile_image_url}
                  alt="Avatar"
                  className={classes.avatar}
                />
              </div>
              <span className={classes["roomcard__avatar-container__link"]}>
                {profile.display_name}
              </span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
