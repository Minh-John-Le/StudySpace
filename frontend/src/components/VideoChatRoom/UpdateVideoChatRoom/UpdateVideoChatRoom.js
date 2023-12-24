import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useInput from "../../../hooks/use-input";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import classes from "./UpdateVideoChatRoom.module.css";
import Cookies from "js-cookie";
import ErrorCard from "../../UI/ErrorCard/ErrorCard";
import FormCard from "../../UI/FormCard/FormCard";
import AuthenticateChecker from "../../Home/AuthenticateChecker";

const UpdateVideoChatRoom = () => {
  //==================================== VARIABLE ===========================

  const [roomInfo, setRoomInfo] = useState([""]);
  const navigate = useNavigate();

  // -------------------------------------- API --------------------------
  const authToken = Cookies.get("authToken");
  const { id } = useParams();
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  // -------------------------------------- Error --------------------------
  const [errorMessage, setErrorMessage] = useState("Please fill in the form!");
  const [hasSubmitError, setHasSubmitError] = useState(false);

  // -------------------------------------- Room Info --------------------------
  const {
    value: enteredRoomName,
    isValid: enteredRoomNameIsValid,
    hasError: roomNameInputHasError,
    valueChangeHandler: roomNameChangedHandler,
    inputBlurHandler: roomNameBlurHandler,
    reset: resetroomNameInput,
  } = useInput((value) => value.trim().length > 0 && value.trim().length <= 32);

  //==================================== FUNCTIONS ===========================
  const cancelHandler = (event) => {
    event.preventDefault();
    navigate(`/video-chat`);
  };

  // Update Room Info
  const submitHandler = async (event) => {
    event.preventDefault();
    const roomData = {
      room_name: enteredRoomName,
    };

    try {
      // Send a PATCH request to your backend login endpoint
      const response = await fetch(
        `${backendUrl}/api/videochat/videochat-room-manager/${id}/`,
        {
          method: "PATCH",
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

      setHasSubmitError(false);
      navigate(`/video-chat`);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Get Room Info
  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const url = `${backendUrl}/api/videochat/videochat-room-manager/${id}/`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
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

          setHasSubmitError(true);
          setErrorMessage(errorMessages);
          throw new Error(errorMessages);
        }

        const roomInfoRs = await response.json();
        setRoomInfo(roomInfoRs);
        setHasSubmitError(false);

        // Set input values based on the received data
        resetroomNameInput(roomInfoRs.room_name);
      } catch (error) {
        // Handle any errors that occur during the fetch or state updates
        console.error("Error fetching room info:", error);
      }
    };

    fetchRoomInfo();
  }, [id, authToken]);

  //==================================== RETURN COMPONENTS ===========================
  return (
    <React.Fragment>
      <AuthenticateChecker></AuthenticateChecker>
      {hasSubmitError && <ErrorCard errorMessages={errorMessage}></ErrorCard>}
      <FormCard title={"Update Room Info"}>
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
              "Room Name cannot be empty and max length is 32 characters."
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
              <div>Update</div>
            </Button>
          </div>
        </form>
      </FormCard>
    </React.Fragment>
  );
};

export default UpdateVideoChatRoom;
