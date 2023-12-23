import React, { useEffect, useRef } from "react";
import Card from "../UI/Card/Card";
import classes from "./MyVideoPlayer.module.css";

const MyVideoPlayer = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.user.videoTrack.play(ref.current);
  }, []);

  return (
    <div className={classes.videoPlayer}>
      <div ref={ref} className={classes.videoContainer}></div>
    </div>
  );
};

export default MyVideoPlayer;
