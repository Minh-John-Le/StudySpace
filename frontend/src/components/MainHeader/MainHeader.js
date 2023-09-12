import React from "react";

import Navigation from "./Navigation";
import classes from "./MainHeader.module.css";
import SearchBar from "./SearchBar";
import { SiStarship } from "react-icons/si";

const MainHeader = (props) => {
  return (
    <header className={classes["main-header"]}>
      <div className={classes["header-content"]}>
        <span className={classes["starship-icon"]}>
          <SiStarship size={48} /> {/* Adjust the size as needed */}
        </span>
        <h1>Study Space</h1>
        <SearchBar></SearchBar>
      </div>
      <Navigation />
    </header>
  );
};

export default MainHeader;
