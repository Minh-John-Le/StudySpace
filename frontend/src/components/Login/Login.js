import React, { useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";
import useInput from "../../hooks/use-input";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = (props) => {
  //==================================== VARIABLE ======================================
  const ctx = useContext(AuthContext);
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
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passowordInputHasError,
    valueChangeHandler: passwordChangedHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput((value) => value.trim().length > 8);

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
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        console.error("Login failed");
        return;
      }

      // Assuming your backend responds with a JSON object containing a "token" field
      const data = await response.json();

      // Store the token in a cookie
      Cookies.set("authToken", data.token, { expires: 7 });

      // Go to Home page
      ctx.changeDisplayName("StudySpaceUser");
      navigate("/");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  //==================================== RETURN COMPONENTS ======================================
  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h2>Login</h2>
      </Card>
      <Card className={classes.login}>
        <form onSubmit={submitHandler}>
          <Input
            id="username"
            label="Username"
            type="text"
            isValid={!usernameInputHasError}
            value={enteredUsername}
            onChange={usernameChangedHandler}
            onBlur={usernameBlurHandler}
            errorMessage={"Username must be length 8 or more"}
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
              errorMessage={"Password must be length 6 or more"}
            ></Input>
          }

          <div className={classes.actions}>
            <Button type="submit" className={classes.btn}>
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
      </Card>
    </React.Fragment>
  );
};

export default Login;
