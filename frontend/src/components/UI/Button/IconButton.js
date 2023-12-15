import React from "react";
import { BiSend } from "react-icons/bi";
import classes from "./IconButton.module.css";

const IconButton = (props) => {
  const {
    icon: IconComponent,
    size,
    onClickHandler,
    buttonClassName,
    iconClassName,
  } = props;

  return (
    <button
      className={`${classes["action-button"]} ${buttonClassName}`}
      onClick={onClickHandler}
    >
      <i className={`${classes["button-icon"]} ${iconClassName}`}>
        <IconComponent size={size} />
      </i>
    </button>
  );
};

// Default values for size, icon (BiSend), and additional classes
IconButton.defaultProps = {
  size: 32,
  icon: BiSend,
  buttonClassName: "",
  iconClassName: "",
};

export default IconButton;
