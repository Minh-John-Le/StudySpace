import React from "react";
import Card from "../Card/Card";
import ScrollableCard from "../Card/ScrollableCard";
import classes from "./ScrollableSideCard.module.css";
import Avatar from "../Avatar/Avatar";
import { Link } from "react-router-dom";

const ScrollableSideCard = (props) => {
  return (
    <React.Fragment>
      <Card className={classes.header}>
        {props.hasTitleLink && (
          <Link className={classes["title-link"]} to={`${props.titleLink}`}>
            <h3>{props.title}</h3>
          </Link>
        )}
        {!props.hasTitleLink && <h3>{props.title}</h3>}
      </Card>

      <ScrollableCard className={classes.body}>
        {props.data &&
          props.data.map((user, index) => (
            <Avatar
              key={user.profile_id}
              avatarLink={`/user/${user.profile_id}/`}
              avatarName={user.avatar_name}
              displayName={user.display_name}
              includeDisplayName={true}
              avatarLinkClassName={[classes["avatar-link"]]}
            />
          ))}
      </ScrollableCard>
    </React.Fragment>
  );
};

export default ScrollableSideCard;
