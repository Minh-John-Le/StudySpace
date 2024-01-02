import React, { useContext, useState } from "react";

import Card from "../UI/Card/Card";
import classes from "./ResetAccount.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";
import useInput from "../../hooks/use-input";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import FormCard from "../UI/FormCard/FormCard";
import ErrorCard from "../UI/ErrorCard/ErrorCard";

const ResetAccount = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();

  //============================== VARIABLE ===============================
  //--------------------------------- API ------------------------------
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //--------------------------------- Error ------------------------------
  const [errorMessage, setErrorMessage] = useState("Please fill in the form!");
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const [sentResetAccountEmail, setSentResetAccountEmail] = useState(false);
  const formIsValid = true;

  //--------------------------------- User Input ------------------------------
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput((value) => value.includes("@"));

  //=========================================== FUNCTION =========================
  const submitHandler = async (event) => {
    event.preventDefault();
    const data = {
      email: enteredEmail,
    };

    try {
      const response = await fetch(
        `${backendUrl}/api/auth/send-reset-account-email/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

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

      setSentResetAccountEmail(true);

      // Reset the button text to its original state after 30 seconds
      setTimeout(() => {
        setSentResetAccountEmail(false);
      }, 30000);

      resetEmailInput();
      setHasSubmitError(false);
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
            id="email"
            label="Email"
            type="email"
            isValid={!emailInputHasError}
            value={enteredEmail}
            onChange={emailChangedHandler}
            onBlur={emailBlurHandler}
            errorMessage={"Email must include @."}
          ></Input>

          {sentResetAccountEmail && (
            <div className={classes["success"]}>
              Successfully sent reset account email. Please check your Inbox /
              Spam folder.
            </div>
          )}

          <div>
            <Button type="submit" disabled={!formIsValid}>
              <div>Submit</div>
            </Button>
          </div>
        </form>
      </FormCard>
      <div className={classes["ending-space"]}></div>
    </React.Fragment>
  );
};

export default ResetAccount;
