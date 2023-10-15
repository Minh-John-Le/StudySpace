import React from "react";
import Card from "../Card/Card";
import classes from "./ErrorCard.module.css";

const ErrorCard = (props) => {
  return (
    <React.Fragment>
      <Card className={`${classes.header} ${props.titleClassName}`}>
        <h2>{props.title}</h2>
      </Card>
      <Card className={`${classes.body} ${props.bodyClassName}`}>
        {props.children}
      </Card>
    </React.Fragment>
  );
};

export default ErrorCard;
