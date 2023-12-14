import React from "react";
import classes from "./UserCard.module.css";
import { FaStar } from "react-icons/fa";
import Avatar from "../Avatar/Avatar";
import Card from "../Card/Card";
const UserCard = (props) => {
  return (
    <React.Fragment>
      <Card className={classes["card-display"]}>
        <div className={classes["counter-display"]}>
          <FaStar className={classes["counter-icon-display"]} />
          {props.rank}
        </div>
        <Avatar
          key={props.profile_id}
          avatarLink={`/user/${props.profile_id}/`}
          avatarName={props.avatar_name}
          displayName={props.display_name}
          includeDisplayName={true}
          avatarLinkClassName={[classes["avatar-link"]]}
        />
      </Card>
    </React.Fragment>
  );
};

export default UserCard;
