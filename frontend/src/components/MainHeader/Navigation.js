import React, { useContext, useState, useEffect } from "react";

import classes from "./Navigation.module.css";
import AuthContext from "../../store/auth-context";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Navigation = (props) => {
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();

  const authToken = Cookies.get("authToken");

  const [profile, setProfile] = useState([]);

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

        const profile = await response.json();
        setProfile(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    if (authToken) {
      fetchProfile(); // Call the function here if authToken is available
    }
  }, [authToken]);

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
