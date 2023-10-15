import React, { useContext, useState, useEffect } from "react";

import Card from "../../UI/Card/Card";
import classes from "./ProfileSetting.module.css";
import Button from "../../UI/Button/Button";
import AuthContext from "../../../store/auth-context";
import Input from "../../UI/Input/Input";
import useInput from "../../../hooks/use-input";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Avatar from "../../UI/Avatar/Avatar";

const ProfileSetting = (props) => {
  //==================================== VARIABLE =====================
  const [profile, setProfile] = useState([""]);
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    value: enteredUsername,
    isValid: enteredUsernameIsValid,
    hasError: usernameInputHasError,
    valueChangeHandler: usernameChangedHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: resetUsernameInput,
  } = useInput((value) => true);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput((value) => true);

  const {
    value: enteredDisplayName,
    isValid: enteredDisplayNameIsValid,
    hasError: displayNameInputHasError,
    valueChangeHandler: displayNameChangedHandler,
    inputBlurHandler: displayNameBlurHandler,
    reset: resetDisplayNameInput,
  } = useInput((value) => value.trim().length > 0 && value.trim().length <= 32);

  const {
    value: enteredBio,
    isValid: enteredBioIsValid,
    hasError: bioInputHasError,
    valueChangeHandler: bioChangedHandler,
    inputBlurHandler: bioBlurHandler,
    reset: resetBioInput,
  } = useInput((value) => true);

  const {
    value: enteredAvatarName,
    isValid: enteredAvatarNameIsValid,
    hasError: avatarNameInputHasError,
    valueChangeHandler: avatarNameChangedHandler,
    inputBlurHandler: avatarNameBlurHandler,
    reset: resetAvatarNameInput,
  } = useInput((value) => value.trim().length > 0 && value.trim().length <= 32);
  //====================================== FUNCTION =========================
  // Going back to user profile main page
  const cancelHandler = (event) => {
    event.preventDefault();
    navigate(`/user/${profile.user}`);
  };

  // Update user Profile
  const submitHandler = async (event) => {
    event.preventDefault();
    const profileData = {
      bio: enteredBio,
      display_name: enteredDisplayName,
      avatar_name: enteredAvatarName,
    };

    try {
      // Send a POST request to your backend login endpoint
      const response = await fetch("http://localhost:8000/api/auth/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        // Handle login error here (e.g., show an error message)
        console.error("Update profile fail");
        return;
      }

      // Assuming your backend responds with a JSON object containing a "token" field
      //const data = await response.json();
      setProfile(profile);
      ctx.changeDisplayName(profile.display_name);
      navigate(`/user/${profile.user}`);
    } catch (error) {
      // Handle any other errors (e.g., network issues)
      console.error("An error occurred:", error);
    }
  };

  //===================================== GET DATA =============================
  // Get user data so it initially fill in all the field
  const authToken = Cookies.get("authToken");
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
    resetDisplayNameInput(profile.display_name);
    resetBioInput(profile.bio);
    resetAvatarNameInput(profile.avatar_name);
  }, [authToken, profile.display_name, profile.bio, profile.avatar_name]);

  //====================================== RETURN COMPONENTS =================================
  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h2>Profile Settings</h2>
      </Card>
      <Card className={classes.login}>
        <form onSubmit={submitHandler}>
          <Input
            id="email"
            label="Email"
            type="email"
            isValid={!emailInputHasError}
            value={profile.email}
            onChange={emailChangedHandler}
            onBlur={emailBlurHandler}
            errorMessage={"Email must include @"}
            readOnly={true}
          ></Input>
          <Input
            id="username"
            label="Username"
            type="text"
            isValid={!usernameInputHasError}
            value={profile.username}
            onChange={usernameChangedHandler}
            onBlur={usernameBlurHandler}
            errorMessage={"Username must be length 8 or more"}
            readOnly={true}
          ></Input>
          <Avatar avatarName={enteredAvatarName}></Avatar>
          <Input
            id="avatarname"
            label="Avatar Name"
            type="text"
            isValid={!avatarNameInputHasError}
            value={enteredAvatarName}
            onChange={avatarNameChangedHandler}
            onBlur={avatarNameBlurHandler}
            errorMessage={"Username must be less than 32 characters"}
            readOnly={false}
          ></Input>

          <Input
            id="display_name"
            label="Display Name"
            type="text"
            isValid={!displayNameInputHasError}
            value={enteredDisplayName}
            onChange={displayNameChangedHandler}
            onBlur={displayNameBlurHandler}
            errorMessage={
              "Display name cannot be empty and must be less than 16 characters"
            }
          ></Input>
          <Input
            id="bio"
            label="Bio"
            type="textarea"
            isValid={!bioInputHasError}
            value={enteredBio}
            onChange={bioChangedHandler}
            onBlur={bioBlurHandler}
            errorMessage={""}
          ></Input>

          <div className={classes.actions}>
            <Button
              type="button"
              className={classes.btn}
              onClick={cancelHandler}
            >
              <div>Cancel</div>
            </Button>
            <Button
              type="submit"
              className={classes.btn}
              // disabled={!formIsValid}
            >
              <div>Update</div>
            </Button>
          </div>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default ProfileSetting;
