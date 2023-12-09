import classes from "./ProfileSearchBar.module.css";
import { GoSearch } from "react-icons/go";

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProfileSearchBar = (props) => {
  //============================== VARIABLE =============================
  const [searchQuery, setSearchQuery] = useState("");

  //---------------------------- API -----------------------------------
  const navigate = useNavigate();
  const { id } = useParams();

  //============================== FUNCTION =============================
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    navigate(`/user/${id}/?topic=${searchQuery}&page=${1}`);
  };

  //============================== RETURN COMPONENTS =============================
  return (
    <form onSubmit={handleFormSubmit} className={classes.searchForm}>
      <div className={classes.searchContainer}>
        <GoSearch className={classes.searchIcon} />
        <input
          type="text"
          id="search"
          placeholder="Search"
          value={searchQuery}
          onChange={handleInputChange}
          className={classes.searchInput}
        />
      </div>
    </form>
  );
};

export default ProfileSearchBar;
