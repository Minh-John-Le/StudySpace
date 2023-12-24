import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import MyVideoPlayer from "./MyVideoPlayer";
import classes from "./VideoChatManager.module.css";
import IconButton from "../UI/Button/IconButton";
import { RiDoorOpenFill } from "react-icons/ri";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { BsMicFill } from "react-icons/bs";
import { BsMicMuteFill } from "react-icons/bs";
import { BsCameraVideoOffFill } from "react-icons/bs";

const APP_ID = process.env.REACT_APP_AGORA_APP_ID;
const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

const VideoChatManager = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [localUid, setLocalUid] = useState(null);
  const [joined, setJoined] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);

  //----------------------------------- API ----------------------------------
  const authToken = Cookies.get("authToken");
  const { roomId } = useParams();
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const navigate = useNavigate();

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  const joinAndDisplayLocalStream = async () => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    try {
      const response = await fetch(
        `${backendUrl}/api/videochat/get-agora-token/${roomId}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      const { token, channel_name, uid, display_name } = await response.json();

      setLocalUid(parseInt(uid));

      const uid_2 = await client.join(
        APP_ID,
        channel_name,
        token,
        parseInt(uid)
      );

      const newTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
      const [audioTrack, videoTrack] = newTracks;

      setLocalTracks(newTracks);
      setTracks(newTracks);
      setUsers((previousUsers) => [
        ...previousUsers,
        {
          uid,
          videoTrack,
          audioTrack,
          display_name,
        },
      ]);

      client.publish(newTracks);

      setJoined(true);
    } catch (error) {
      console.error(error);
    }
  };

  const leaveAndRemoveLocalStream = async () => {
    navigate(`/video-chat`);
  };

  const toggleCamera = async (e) => {
    if (localTracks[1].muted) {
      await localTracks[1].setMuted(false);
      setIsCameraEnabled(true);
    } else {
      await localTracks[1].setMuted(true);
      setIsCameraEnabled(false);
    }
  };

  let toggleMic = async (e) => {
    console.log("TOGGLE MIC TRIGGERED");
    if (localTracks[0].muted) {
      await localTracks[0].setMuted(false);
      setIsMicEnabled(true);
    } else {
      await localTracks[0].setMuted(true);
      setIsMicEnabled(false);
    }
  };

  useEffect(() => {
    joinAndDisplayLocalStream();

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);

      if (joined) {
        // Only unpublish and leave if the client has successfully joined
        client.unpublish(tracks).then(() => client.leave());
      }
    };
  }, [localTracks, tracks, joined]);

  return (
    <React.Fragment>
      <div className={classes["user-video-player-group"]}>
        {users.map((user) => (
          <MyVideoPlayer
            key={user.uid}
            user={user}
            displayName={user.display_name}
          />
        ))}
      </div>
      <div className={classes["button-group"]}>
        <IconButton
          icon={isCameraEnabled ? BsFillCameraVideoFill : BsCameraVideoOffFill}
          onClickHandler={toggleCamera}
        />
        <IconButton
          icon={isMicEnabled ? BsMicFill : BsMicMuteFill}
          onClickHandler={toggleMic}
        />
        <IconButton
          icon={RiDoorOpenFill}
          onClickHandler={leaveAndRemoveLocalStream}
        />
      </div>
    </React.Fragment>
  );
};

export default VideoChatManager;
