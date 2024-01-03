import React, { useState } from "react";
import classes from "./SelectInput.module.css";

const SelectInput = (props) => {
  return (
    <React.Fragment>
      <div className={classes["select-label"]}>
        <label htmlFor={props.id}>{props.label}</label>
      </div>
      <div>
        <select
          className={classes["select-box"]}
          id={props.id}
          value={props.value}
          onChange={props.onChange}
        >
          {props.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </React.Fragment>
  );
};

export default SelectInput;
