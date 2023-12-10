import React from "react";
import Card from "../Card/Card";
import classes from "./HotTopicSideCard.module.css";

import { Link } from "react-router-dom";
const HotTopicSideCard = (props) => {
  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h3>{props.title}</h3>
      </Card>

      <Card className={classes.body}>
        {props.data &&
          props.data.map((hotTopic, index) => (
            <Link
              key={index}
              to={`/?topic=${hotTopic.topic}&page=1`}
              className={classes.avatarLink}
            >
              <span className={classes["avatarLink__display-name"]}>
                {`${hotTopic.topic} (${hotTopic.topic_count})`}
              </span>
            </Link>
          ))}
      </Card>
    </React.Fragment>
  );
};

export default HotTopicSideCard;
