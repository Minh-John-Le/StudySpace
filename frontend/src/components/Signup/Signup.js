import React, { useContext, useState } from "react";

import Card from "../UI/Card/Card";
import classes from "./Signup.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";
import useInput from "../../hooks/use-input";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import FormCard from "../UI/FormCard/FormCard";
import ErrorCard from "../UI/ErrorCard/ErrorCard";

const Signup = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("Please fill in the form!");
  const [hasSubmitError, setHasSubmitError] = useState(false);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput((value) => value.includes("@"));

  const {
    value: enteredUsername,
    isValid: enteredUsernameIsValid,
    hasError: usernameInputHasError,
    valueChangeHandler: usernameChangedHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: resetUsernameInput,
  } = useInput(
    (value) => value.trim().length >= 8 && value.trim().length <= 32
  );

  const {
    value: enteredDisplayName,
    isValid: enteredDisplayNameIsValid,
    hasError: displayNameInputHasError,
    valueChangeHandler: displayNameChangedHandler,
    inputBlurHandler: displayNameBlurHandler,
    reset: resetDisplayNameInput,
  } = useInput((value) => value.trim().length > 0 && value.trim().length <= 20);

  const isPasswordValid = (password) => {
    // Regular expression for password requirements
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$/;
    return passwordPattern.test(password);
  };

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passowordInputHasError,
    valueChangeHandler: passwordChangedHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput(isPasswordValid);

  const {
    value: enteredRepeatedPassword,
    isValid: enteredRepeatedPasswordIsValid,
    hasError: repatedPasswordInputHasError,
    valueChangeHandler: repeatedPasswordChangedHandler,
    inputBlurHandler: repeatedPasswordBlurHandler,
    reset: resetRepeatedPasswordInput,
  } = useInput((value) => value.trim().length >= 8);

  const submitHandler = async (event) => {
    event.preventDefault();
    const data = {
      username: enteredUsername,
      email: enteredEmail,
      password: enteredPassword,
      repeat_password: enteredRepeatedPassword,
      display_name: enteredDisplayName,
    };

    try {
      const response = await fetch("http://localhost:8000/api/auth/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorObject = await response.json(); // Parse the error response
        const errorData = errorObject.error;
        console.log(errorData);

        // Create an array to store error messages
        const errorMessages = [];

        // Format all error messages dynamically
        Object.keys(errorData).forEach((key) => {
          if (Array.isArray(errorData[key])) {
            errorData[key].forEach((error) => {
              errorMessages.push(`${key}: ${error}`);
            });
          } else {
            errorMessages.push(`${key}: ${errorData[key]}`);
          }
        });

        setErrorMessage(errorMessages); // Set as an array of error messages
        throw new Error(errorMessages);
      }

      const rs = await response.json();

      console.log(rs);
      // Clear input fields and reset error state
      resetEmailInput();
      resetUsernameInput();
      resetPasswordInput();
      resetRepeatedPasswordInput();
      setHasSubmitError(false);

      navigate("/login");
    } catch (error) {
      // Handle signup failure
      setHasSubmitError(true);
    }
  };
  const formIsValid = true;
  return (
    <React.Fragment>
      {hasSubmitError && <ErrorCard errorMessages={errorMessage}></ErrorCard>}
      <FormCard title={"Signup"}>
        <form onSubmit={submitHandler}>
          <Input
            id="email"
            label="Email"
            type="email"
            isValid={!emailInputHasError}
            value={enteredEmail}
            onChange={emailChangedHandler}
            onBlur={emailBlurHandler}
            errorMessage={"Email must include @."}
          ></Input>

          <Input
            id="username"
            label="Username"
            type="text"
            isValid={!usernameInputHasError}
            value={enteredUsername}
            onChange={usernameChangedHandler}
            onBlur={usernameBlurHandler}
            errorMessage={
              "Username length must be between 8 and 32 characters."
            }
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
              "Display name cannot be empty and must be less than 20 characters."
            }
          ></Input>

          <Input
            id="password"
            label="Password"
            type="password"
            isValid={!passowordInputHasError}
            value={enteredPassword}
            onChange={passwordChangedHandler}
            onBlur={passwordBlurHandler}
            errorMessage={
              "Password must meet the following requirements: at least 8 characters in length, contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit."
            }
          ></Input>

          <Input
            id="repeat_password"
            label="Reapeat Password"
            type="password"
            isValid={!repatedPasswordInputHasError}
            value={enteredRepeatedPassword}
            onChange={repeatedPasswordChangedHandler}
            onBlur={repeatedPasswordBlurHandler}
            errorMessage={
              "Password must meet the following requirements: at least 8 characters in length, contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit."
            }
          ></Input>

          <div className={classes.actions}>
            <Button
              type="submit"
              className={classes.btn}
              disabled={!formIsValid}
            >
              <div>Signup</div>
            </Button>
          </div>

          <br></br>
          <div className={classes.loginPrompt}>
            Have already signed up?
            <br></br>
            <Link to="/login/" className={classes.loginLink}>
              Log in
            </Link>
          </div>
        </form>
      </FormCard>
    </React.Fragment>
  );
};

export default Signup;
