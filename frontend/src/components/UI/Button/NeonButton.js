import React from "react";
import classes from "./NeonButton.module.css";

const NeonButton = ({ onClickHandler, buttonText, btnClassName }) => {
  return (
    <button
      className={`${classes["btn"]} ${btnClassName}`}
      onClick={onClickHandler}
    >
      <div>{buttonText}</div>
    </button>
  );
};

export default NeonButton;
