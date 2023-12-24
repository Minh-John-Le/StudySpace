import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import classes from "./JoinRoomForm.module.css";
import Cookies from "js-cookie";
import Card from "../UI/Card/Card";
import { useNavigate } from "react-router-dom";
import NeonButton from "../UI/Button/NeonButton";

const JoinRoomForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  //----------------------------------- API ----------------------------------
  const authToken = Cookies.get("authToken");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //================================= FUNCTIONS =============================
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const addRoomHandler = (event) => {
    navigate("/new-video-chat-room");
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${backendUrl}/api/videochat/join-videochat-room/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
          body: JSON.stringify({ invitation_uuid: searchQuery }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <Card className={classes["search-button-display"]}>
      <form onSubmit={handleFormSubmit} className={classes.searchForm}>
        <div className={classes.searchContainer}>
          <GoSearch className={classes.searchIcon} />
          <input
            type="text"
            id="invitation"
            placeholder="Invitation Code"
            value={searchQuery}
            onChange={handleInputChange}
            className={classes.searchInput}
          />
        </div>
      </form>

      <div className={classes["button-group-display"]}>
        <div className={classes["button-display"]}>
          <NeonButton
            buttonText={"+ New Room"}
            onClickHandler={addRoomHandler}
          ></NeonButton>
        </div>
      </div>
    </Card>
  );
};

export default JoinRoomForm;
