import React from "react";
import classes from "./Input.module.css";

const Input = (props) => {
  const inputStyles = {
    height: props.type === "textarea" ? "3rem" : "auto", // Set the height for textareas
  };

  const inputClass = props.type === "textarea" ? classes.textarea : "";

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
        {props.type === "textarea" ? (
          <textarea
            id={props.id}
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
            style={inputStyles}
            readOnly={props.readOnly}
            className={inputClass} // Apply the textarea class
          />
        ) : (
          <input
            type={props.type}
            id={props.id}
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
            style={inputStyles}
            readOnly={props.readOnly}
          />
        )}
      </div>

      <div className={classes["error-text"]}>
        {!props.isValid && <p className="error-text">{props.errorMessage}</p>}
      </div>
    </React.Fragment>
  );
};

export default Input;
