import React from "react";
import classes from "./SearchBar.module.css";
import { GoSearch } from "react-icons/go";

const SearchBar = () => {
  return (
    <form id="searchForm" method="GET" action="/">
      <div className={classes.control}>
        <div className={classes.searchContainer}>
          <GoSearch className={classes.searchIcon} />
          <input type="text" id="search" placeholder="Search" />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
