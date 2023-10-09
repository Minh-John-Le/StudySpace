import React, { useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./ProfileSetting.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";
import useInput from "../../hooks/use-input";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProfileSetting = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    value: enteredUsername,
    isValid: enteredUsernameIsValid,
    hasError: usernameInputHasError,
    valueChangeHandler: usernameChangedHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: resetUsernameInput,
  } = useInput((value) => value.trim().length > 8);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput((value) => value.includes("@"));


  const {
    value: enteredDisplayName,
    isValid: enteredDisplayNameIsValid,
    hasError: displayNameInputHasError,
    valueChangeHandler: displayNameChangedHandler,
    inputBlurHandler: displayNameBlurHandler,
    reset: resetDisplayNameInput,
  } = useInput((value) => value.trim().length > 0  && value.trim().length <= 16);


  const {
    value: enteredBio,
    isValid: enteredBioIsValid,
    hasError: bioInputHasError,
    valueChangeHandler: bioChangedHandler,
    inputBlurHandler: bioBlurHandler,
    reset: resetBioInput,
  } = useInput((value) => true);

  


  const submitHandler = async (event) => {
    event.preventDefault();
  };

  const formIsValid = enteredUsernameIsValid;
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
            value={enteredEmail}
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
            value={enteredUsername}
            onChange={usernameChangedHandler}
            onBlur={usernameBlurHandler}
            errorMessage={"Username must be length 8 or more"}
            readOnly={true}
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
