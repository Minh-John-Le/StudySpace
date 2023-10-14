import React from "react";
import classes from "./Avatar.module.css";
import { Link } from "react-router-dom";
import multiavatar from "@multiavatar/multiavatar";

const Avatar = (props) => {
  const svgCode = multiavatar(props.avatarName);

  return (
    <Link
      to={props.avatarLink}
      className={`${classes["avatar-link"]} ${props.avatarLinkClassName}`}
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
          className={`${classes["avatar-link__name"]} ${props.displayNameClassName}`}
        >
          {props.displayName}
        </span>
      )}
    </Link>
  );
};

export default Avatar;
