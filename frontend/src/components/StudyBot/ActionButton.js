import React from "react";
import { BiSend } from "react-icons/bi";
import { MdInsertPhoto } from "react-icons/md";

import classes from "./ActionButton.module.css";

const ActionButton = () => {
  return (
    <React.Fragment>
      <div className={classes["action-button-group"]}>
        <button className={classes["action-button"]}>
          <BiSend size={32} className={classes["button-icon"]} />
        </button>
        <button className={classes["action-button"]}>
          <MdInsertPhoto size={32} className={classes["button-icon"]} />
        </button>
      </div>
    </React.Fragment>
  );
};

export default ActionButton;
