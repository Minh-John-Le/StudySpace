import React from "react";
import Card from "../Card/Card";
import classes from "./ErrorCard.module.css";

function formatErrorMessage(errorMessage) {
  return errorMessage
    .split(": ")
    .map((part) => {
      return part
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    })
    .join(": ");
}

const ErrorCard = (props) => {
  return (
    <React.Fragment>
      <Card className={`${classes.header} ${props.titleClassName}`}>
        <h2>Error</h2>
      </Card>
      <Card className={`${classes.body} ${props.bodyClassName}`}>
        <div>
          {props.errorMessages.map((err, index) => (
            <Card
              className={`${classes.error} ${props.errorClassName}`}
              key={index}
            >
              {formatErrorMessage(err)}
            </Card>
          ))}
        </div>
      </Card>
    </React.Fragment>
  );
};

export default ErrorCard;
