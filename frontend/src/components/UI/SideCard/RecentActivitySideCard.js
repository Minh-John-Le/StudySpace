import React from "react";
import Card from "../Card/Card";
import ScrollableCard from "../Card/ScrollableCard";
import classes from "./RecentActivitySideCard.module.css";

import { Link } from "react-router-dom";
const RecentActivitySideCard = (props) => {
  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h3>{props.title}</h3>
      </Card>

      <ScrollableCard className={classes.body}>
        
      </ScrollableCard>
    </React.Fragment>
  );
};

export default RecentActivitySideCard;
