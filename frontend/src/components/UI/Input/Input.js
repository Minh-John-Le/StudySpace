import React from "react";
import classes from "./Input.module.css";

const Input = (props) => {
  return (
    <React.Fragment>
      <div className={classes.control}>
        <label htmlFor={props.id}>{props.label}</label>
      </div>
      <div
        className={`${classes.control} ${
          props.isValid === false ? classes.invalid : ""
        }`}
      >
        <input
          type={props.type}
          id={props.id}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          readOnly={props.readOnly} 
        />
      </div>

      <div className={classes["error-text"]}>
        {!props.isValid && <p className="error-text">{props.errorMessage}</p>}
      </div>
    </React.Fragment>
  );
};

export default Input;
