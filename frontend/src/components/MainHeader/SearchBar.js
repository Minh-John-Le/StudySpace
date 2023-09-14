import classes from "./SearchBar.module.css";
import { GoSearch } from "react-icons/go";

import React, { useState } from "react";
import { useNavigate} from "react-router-dom";

const SearchBar = ({ onSearch }) => {
  // State to store the search query
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Event handler to update the search query
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Event handler to handle form submission when Enter is pressed
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    navigate("/?topic=" + searchQuery + "&?page=1");
  };

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
