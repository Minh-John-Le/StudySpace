import React from "react";

import classes from "./ScrollableCard.module.css";

const ScrollableCard = (props) => {
  return (
    <div className={`${classes.scrollableCard} ${props.className}`}>
      <div className={classes.scrollableCardContent}>{props.children}</div>
    </div>
  );
};

export default ScrollableCard;
