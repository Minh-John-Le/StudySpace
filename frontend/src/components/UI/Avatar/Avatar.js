import React from "react";
import classes from "./Avatar.module.css";
import { Link } from "react-router-dom";
import multiavatar from "@multiavatar/multiavatar";

const Avatar = (props) => {
  const svgCode = multiavatar(props.avatarName);

  return (
    <Link
      to={props.userLink}
      className={`${classes["avatar-link"]} ${props.linkClassName}`}
    >
      <div
        className={`${classes["avatar-link__avatar-border"]} ${props.imageClassName}`}
      >
        <div
          className={classes["avatar-link__avatar-image"]}
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      </div>
      {props.includeDisplayName && (
        <span
          className={`${classes["avatar-link__name"]} ${props.disaplyNameClassName}`}
        >
          {"Minh Hung Le"}
        </span>
      )}
    </Link>
  );
};

export default Avatar;
