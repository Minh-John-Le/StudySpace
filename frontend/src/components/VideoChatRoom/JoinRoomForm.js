import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import classes from "./JoinRoomForm.module.css";
import Cookies from "js-cookie";
import Card from "../UI/Card/Card";

const JoinRoomForm = () => {
  const [searchQuery, setSearchQuery] = useState("");

  //----------------------------------- API ----------------------------------
  const authToken = Cookies.get("authToken");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //================================= FUNCTIONS =============================
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
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
    </Card>
  );
};

export default JoinRoomForm;
