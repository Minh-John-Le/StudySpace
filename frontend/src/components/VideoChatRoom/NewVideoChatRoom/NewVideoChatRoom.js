import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useInput from "../../../hooks/use-input";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import classes from "./NewVideoChatRoom.module.css";
import Cookies from "js-cookie";
import FormCard from "../../UI/FormCard/FormCard";
import ErrorCard from "../../UI/ErrorCard/ErrorCard";
import AuthenticateChecker from "../../Home/AuthenticateChecker";

const NewVideoChatRoom = () => {
  //================================== VARIABLE ========================
  //-------------------------------- API ---------------------------------
  const navigate = useNavigate();
  const authToken = Cookies.get("authToken");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //-------------------------------- Error ---------------------------------
  const [errorMessage, setErrorMessage] = useState("Please fill in the form!");
  const [hasSubmitError, setHasSubmitError] = useState(false);

  //-------------------------------- Room Info ---------------------------------
  const {
    value: enteredRoomName,
    isValid: enteredRoomNameIsValid,
    hasError: roomNameInputHasError,
    valueChangeHandler: roomNameChangedHandler,
    inputBlurHandler: roomNameBlurHandler,
    reset: resetroomNameInput,
  } = useInput((value) => value.trim().length > 0 && value.trim().length <= 32);

  //================================== GET DATA/ FUNCTION ===========================
  // Go back to Home Page
  const cancelHandler = (event) => {
    event.preventDefault();
    navigate(`/video-chat`);
  };

  // Go Create a new room then go to that room
  const submitHandler = async (event) => {
    event.preventDefault();
    const roomData = {
      room_name: enteredRoomName,
    };

    try {
      // Send a POST request to your backend login endpoint
      const response = await fetch(
        `${backendUrl}/api/videochat/new-videochat-room/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
          body: JSON.stringify(roomData),
        }
      );

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

        setHasSubmitError(true);
        setErrorMessage(errorMessages);
        throw new Error(errorMessages);
      }

      const data = await response.json();
      setHasSubmitError(true);
      navigate(`/video-chat`);
    } catch (error) {
      console.error("Create Room Error:", error);
    }
  };

  //================================== RETURN COMPONENTS ===========================
  return (
    <React.Fragment>
      <AuthenticateChecker></AuthenticateChecker>
      {hasSubmitError && <ErrorCard errorMessages={errorMessage}></ErrorCard>}
      <FormCard title={"VideoChat Room Info"}>
        <form onSubmit={submitHandler}>
          <Input
            id="room_name"
            label="Room Name"
            type="text"
            isValid={!roomNameInputHasError}
            value={enteredRoomName}
            onChange={roomNameChangedHandler}
            onBlur={roomNameBlurHandler}
            errorMessage={
              "Room Name cannot be empty and max length is 32 characters"
            }
          ></Input>

          <div className={classes.actions}>
            <Button
              type="button"
              className={classes.btn}
              onClick={cancelHandler}
            >
              <div>Cancel</div>
            </Button>
            <Button type="submit" className={classes.btn}>
              <div>Create</div>
            </Button>
          </div>
        </form>
      </FormCard>
    </React.Fragment>
  );
};

export default NewVideoChatRoom;
