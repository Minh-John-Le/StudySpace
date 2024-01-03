import React, { useContext, useState } from "react";

import classes from "./ResetAccount.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import useInput from "../../hooks/use-input";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import FormCard from "../UI/FormCard/FormCard";
import ErrorCard from "../UI/ErrorCard/ErrorCard";
import { useParams } from "react-router-dom";

const ResetAccount = (props) => {
  //============================== VARIABLE ===============================
  //--------------------------------- API ------------------------------
  const navigate = useNavigate();
  //----------------------- API --------------------------------------
  const { secToken } = useParams();
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //--------------------------------- Error ------------------------------
  const [errorMessage, setErrorMessage] = useState("Please fill in the form!");
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formIsValid = true;

  //--------------------------------- User Input ------------------------------

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
  } = useInput(isPasswordValid);

  //=========================================== FUNCTION =========================

  const submitHandler = async (event) => {
    event.preventDefault();
    const data = {
      token_value: secToken,
      new_password: enteredPassword,
      confirm_password: enteredRepeatedPassword,
    };

    try {
      const response = await fetch(`${backendUrl}/api/auth/reset-account/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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
      resetPasswordInput();
      resetRepeatedPasswordInput();
      setHasSubmitError(false);

      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        navigate("/login");
      }, 5000);
    } catch (error) {
      // Handle signup failure
      setHasSubmitError(true);
    }
  };

  //=========================================== RETURN COMPONENTS =========================

  return (
    <React.Fragment>
      {hasSubmitError && <ErrorCard errorMessages={errorMessage}></ErrorCard>}
      <FormCard title={"Reset Account"}>
        <form onSubmit={submitHandler}>
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
          {isSuccess && (
            <div className={classes["success"]}>
              Successfully reset your account! Auto navigate to login in 5
              seconds!
            </div>
          )}
          <div>
            <Button type="submit" disabled={!formIsValid}>
              <div>Submit</div>
            </Button>
          </div>
        </form>
      </FormCard>
    </React.Fragment>
  );
};

export default ResetAccount;
