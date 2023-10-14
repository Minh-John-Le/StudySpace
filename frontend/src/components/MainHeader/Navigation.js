import React, { useState, useEffect, useContext } from "react";

import classes from "./Navigation.module.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import AuthContext from "../../store/auth-context";
import Avatar from "../UI/Avatar/Avatar";

const Navigation = (props) => {
  //=============================== VARIABLE =======================================
  const ctx = useContext(AuthContext);

  //const navigation = useNavigate();
  const [profile, setProfile] = useState([]);
  const [avatar, setAvatar] = useState("1");
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
  }, [authToken, ctx.displayName]);

  const generateRandomNumber = () => {
    const min = 1;
    const max = 12230590464;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    setAvatar(randomNum);
  };

  useEffect(() => {
    generateRandomNumber();
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
                  src={`https://api.multiavatar.com/${avatar}.svg`}
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
            <Avatar
              avatarLink={`/user/${profile.user}/`}
              avatarName={profile.avatar_name}
              displayName={profile.display_name}
              includeDisplayName={true}
            />
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
