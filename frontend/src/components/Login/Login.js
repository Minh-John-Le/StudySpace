import React, { useContext, useState } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";
import useInput from "../../hooks/use-input";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import FormCard from "../UI/FormCard/FormCard";
import ErrorCard from "../UI/ErrorCard/ErrorCard";

const Login = (props) => {
  //==================================== VARIABLE ======================================
  const [errorMessage, setErrorMessage] = useState("Please fill in the form!");
  const [hasSubmitError, setHasSubmitError] = useState(false);

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  const ctx = useContext(AuthContext);
  const navigate = useNavigate();

  const isPasswordValid = (password) => {
    // Regular expression for password requirements
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$/;
    return passwordPattern.test(password);
  };

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
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passowordInputHasError,
    valueChangeHandler: passwordChangedHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput(isPasswordValid);

  //==================================== GET DATA ======================================
  // Log in with user username and password
  const submitHandler = async (event) => {
    event.preventDefault();
    // Create an object with the login data
    const loginData = {
      username: enteredUsername,
      password: enteredPassword,
    };

    try {
      const response = await fetch(`${backendUrl}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorObject = await response.json(); // Parse the error response
        const errorData = errorObject;
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

        setHasSubmitError(true);
        setErrorMessage(errorMessages);
        throw new Error(errorMessages);
      }

      // Assuming your backend responds with a JSON object containing a "token" field
      const data = await response.json();

      // Store the token in a cookie
      Cookies.set("authToken", data.token, { expires: 7 });

      // Go to Home page
      ctx.changeDisplayName("StudySpaceUser");
      setHasSubmitError(false);
      navigate("/");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  //==================================== RETURN COMPONENTS ======================================
  return (
    <React.Fragment>
      {hasSubmitError && <ErrorCard errorMessages={errorMessage}></ErrorCard>}
      <FormCard title={"Login"}>
        <form onSubmit={submitHandler}>
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
          {
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
          }

          <div>
            <Button type="submit">
              <div>Login</div>
            </Button>
          </div>

          <br></br>
          <div className={classes.signup}>
            Haven't signed up yet?
            <br></br>
            <Link to="/signup/" className={classes["signup-link"]}>
              Sign up
            </Link>
          </div>
        </form>
      </FormCard>
    </React.Fragment>
  );
};

export default Login;
