import React, { useState } from "react";
import Input from "../../UI/Input/Input";
import useInput from "../../../hooks/use-input";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ErrorCard from "../../UI/ErrorCard/ErrorCard";
import FormCard from "../../UI/FormCard/FormCard";
import Button from "../../UI/Button/Button";
import classes from "./UpdateUsername.module.css";

const UpdateUsername = (props) => {
  //============================== VARIABLE ===============================
  //--------------------------------- API ------------------------------
  const navigate = useNavigate(props);
  const authToken = Cookies.get("authToken");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //--------------------------------- Error ------------------------------
  const [errorMessage, setErrorMessage] = useState("Please fill in the form!");
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const formIsValid = true;

  //--------------------------------- User Input ------------------------------

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

  //=========================================== FUNCTION =========================
  const submitHandler = async (event) => {
    event.preventDefault();
    const data = {
      new_username: enteredUsername,
      current_password: enteredPassword,
    };

    try {
      const response = await fetch(`${backendUrl}/api/auth/update-username/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorObject = await response.json(); // Parse the error response
        const errorData = errorObject.error;

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

      // Clear input fields and reset error state
      resetUsernameInput();
      resetPasswordInput();
      setHasSubmitError(false);

      navigate("/profile-setting");
    } catch (error) {
      // Handle signup failure
      setHasSubmitError(true);
    }
  };

  const onCancelHandler = (event) => {
    event.preventDefault();
    navigate("/profile-setting");
  };
  //=========================================== RETURN COMPONENTS =========================

  return (
    <React.Fragment>
      {hasSubmitError && <ErrorCard errorMessages={errorMessage}></ErrorCard>}
      <FormCard title={"Update Username"}>
        <form onSubmit={submitHandler}>
          <Input
            id="username"
            label="New Username"
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

          <div className={classes["btn-group"]}>
            <Button type="submit" disabled={!formIsValid}>
              <div>Update</div>
            </Button>
            <Button type="button" onClick={onCancelHandler}>
              <div>Cancel</div>
            </Button>
          </div>
        </form>
      </FormCard>
      <div className={classes["ending-space"]}></div>
    </React.Fragment>
  );
};

export default UpdateUsername;
