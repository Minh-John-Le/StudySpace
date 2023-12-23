import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import MyVideoPlayer from "./MyVideoPlayer";
import classes from "./VideoChatManager.module.css";

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
  const [joined, setJoined] = useState(false); // Track if the client has joined successfully

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
      const { token, channel_name, uid } = await response.json();

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
        },
      ]);

      client.publish(newTracks);

      setJoined(true); // Set joined to true after successful join

      console.log("useEffect");
      console.log(users);
    } catch (error) {
      console.error(error);
      // Handle join error
    }
  };

  const leaveAndRemoveLocalStream = async () => {
    navigate(`/video-chat`);
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
          <MyVideoPlayer key={user.uid} user={user} />
        ))}
      </div>
      <button onClick={leaveAndRemoveLocalStream}>Leave</button>
    </React.Fragment>
  );
};

export default VideoChatManager;
