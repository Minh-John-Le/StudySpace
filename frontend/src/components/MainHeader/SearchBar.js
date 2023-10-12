import classes from "./SearchBar.module.css";
import { GoSearch } from "react-icons/go";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = (props) => {
  //============================ VARIABLE ==============================
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  //============================ FUNCTION ==============================
  // Search input function
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // perform the search
  const handleFormSubmit = (event) => {
    event.preventDefault();
    navigate("/?topic=" + searchQuery + "&page=1");
  };

  //============================ RETURN COMPONENTS ==============================
  return (
    <form onSubmit={handleFormSubmit}>
      <div className={classes.control}>
        <div className={classes.searchContainer}>
          <GoSearch className={classes.searchIcon} />
          <input
            type="text"
            id="search"
            placeholder="Search"
            value={searchQuery}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
