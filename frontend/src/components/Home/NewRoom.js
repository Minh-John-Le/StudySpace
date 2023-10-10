import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useInput from "../../hooks/use-input";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import classes from "./NewRoom.module.css";
import Card from "../UI/Card/Card";
import AuthContext from "../../store/auth-context";
import Cookies from "js-cookie";

const NewRoom = () => {
  const [roomId, setRoomId] = useState([""]);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const authToken = Cookies.get("authToken");

  const {
    value: enteredTopic,
    isValid: enteredTopicIsValid,
    hasError: topicInputHasError,
    valueChangeHandler: topicChangedHandler,
    inputBlurHandler: topicBlurHandler,
    reset: resetTopicInput,
  } = useInput((value) => value.trim().length > 0 && value.trim().length <= 16);

  const {
    value: enteredRoomName,
    isValid: enteredRoomNameIsValid,
    hasError: roomNameInputHasError,
    valueChangeHandler: roomNameChangedHandler,
    inputBlurHandler: roomNameBlurHandler,
    reset: resetroomNameInput,
  } = useInput((value) => value.trim().length > 0 && value.trim().length <= 32);

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionInputHasError,
    valueChangeHandler: descriptionChangedHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetDescriptionInput,
  } = useInput((value) => value.trim().length <= 256);

  const cancelHandler = (event) => {
    event.preventDefault();
    navigate(`/`);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const roomData = {
      room_name: enteredRoomName,
      description: enteredDescription,
      topic: enteredTopic,
    };

    try {
      // Send a POST request to your backend login endpoint

      const response = await fetch(
        "http://localhost:8000/api/database/new-room/",
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
        return;
      }
      const data = await response.json();
      setRoomId(data.room_id);
    } catch (error) {
      // Handle any other errors (e.g., network issues)
      console.error("An error occurred:", error);
    }
  };

  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h2>Profile Settings</h2>
      </Card>
      <Card className={classes.login}>
        <form onSubmit={submitHandler}>
          <Input
            id="topic"
            label="Topic"
            type="text"
            isValid={!topicInputHasError}
            value={enteredTopic}
            onChange={topicChangedHandler}
            onBlur={topicBlurHandler}
            errorMessage={
              "Topic cannot be empty and max length is 16 characters"
            }
          ></Input>
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
          <Input
            id="descripion"
            label="Descripion"
            type="textarea"
            isValid={!descriptionInputHasError}
            value={enteredDescription}
            onChange={descriptionChangedHandler}
            onBlur={descriptionBlurHandler}
            errorMessage={"description's maxlength is 256 characters"}
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
      </Card>
    </React.Fragment>
  );
};

export default NewRoom;
