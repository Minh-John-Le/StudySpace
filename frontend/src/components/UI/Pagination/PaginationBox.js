import React from "react";
import classes from "./PaginationBox.module.css";

const PaginationBox = (props) => {
  return (
    <form onSubmit={props.handleFormSubmit}>
      <div className={classes.pagination}>
        <button type="button" onClick={props.handleDecrement}>
          {"<"}
        </button>
        <input
          type="number"
          id="page"
          min="1"
          step="1"
          value={props.pageNumberInput}
          onChange={(event) => {
            const newPageNumber = parseInt(event.target.value);
            props.setPageNumberInput(newPageNumber);
          }}
        />
        <button type="button" onClick={props.handleIncrement}>
          {">"}
        </button>
      </div>
    </form>
  );
};

export default PaginationBox;
