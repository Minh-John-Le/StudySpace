import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useInput from "../../hooks/use-input";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import classes from "./UpdateRoom.module.css";
import Card from "../UI/Card/Card";
import AuthContext from "../../store/auth-context";
import Cookies from "js-cookie";

const UpdateRoom = () => {
  const [roomInfo, setRoomInfo] = useState([""]);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const authToken = Cookies.get("authToken");
  const { id } = useParams();

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
    navigate(`/room/${id}`);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const roomData = {
      room_name: enteredRoomName,
      description: enteredDescription,
      topic: enteredTopic,
    };

    try {
      // Send a PATCH request to your backend login endpoint
      const response = await fetch(
        `http://localhost:8000/api/database/room-manager/${id}/`,
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
        return;
      }

      navigate(`/room/${id}`)
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const url = `http://localhost:8000/api/database/room-manager/${id}/`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        });

        if (!response.ok) {
          // Handle the error here if needed
          return;
        }

        const roomInfoRs = await response.json();
        setRoomInfo(roomInfoRs);

        // Log the updated roomInfo after it's set
        console.log(roomInfoRs);

        // Set input values based on the received data
        resetroomNameInput(roomInfoRs.room_name);
        resetTopicInput(roomInfoRs.topic);
        resetDescriptionInput(roomInfoRs.description);
      } catch (error) {
        // Handle any errors that occur during the fetch or state updates
        console.error("Error fetching room info:", error);
      }
    };

    fetchRoomInfo();
  }, [id, authToken]);


  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h2>Update Room Info</h2>
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
              <div>Update</div>
            </Button>
          </div>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default UpdateRoom;
