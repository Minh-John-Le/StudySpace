import React from "react";
import Avatar from "../UI/Avatar/Avatar";
import classes from "./HostInfoCard.module.css";
import Card from "../UI/Card/Card";
import { FaStar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const HostInfoCard = (props) => {
  return (
    <React.Fragment>
      <Card className={classes["card-display"]}>
        <div className={classes["rank-display"]}>
          <FaStar className={classes["rank-icon-display"]} />
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
        <div className={classes["follower-display"]}>
          <FaHeart className={classes["follower-icon-display"]} />
          {" " + props.follower_count}
        </div>
      </Card>
    </React.Fragment>
  );
};

export default HostInfoCard;
