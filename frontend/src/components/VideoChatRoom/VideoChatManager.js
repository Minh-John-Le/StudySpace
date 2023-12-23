import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";

const APP_ID = process.env.REACT_APP_AGORA_APP_ID;
const TOKEN =
  "007eJxTYIieonrq2awMuaWmm5TPupfyb6vT6lXLXdhdLGh2b5cJT64Cg5mlSVpKSrJpirmJpYlBWmJSkoWZeZqBaVKSSZqZhWHyke621IZARoa+zh2sjAwQCOKzMJSkFpcwMAAA6wsevw=="; // Replace with your actual token
const CHANNEL = "test";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

const VideoChatManager = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [localUid, setLocalUid] = useState(null);

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      // user.audioTrack.play()
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
      const uid = await client.join(APP_ID, CHANNEL, TOKEN, null);
      setLocalUid(uid);

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

      console.log("useEffect");
      console.log(users);
    } catch (error) {
      console.error(error);
      // Handle join error
    }
  };

  const leaveAndRemoveLocalStream = async () => {
    for (let localTrack of localTracks) {
      localTrack.stop();
      localTrack.close();
    }

    await client.leave();
    setLocalUid(null);
    //window.location.reload(); // Reload the page or navigate to another page
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
      client.unpublish(tracks).then(() => client.leave());
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 200px)",
        }}
      >
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
      <button onClick={leaveAndRemoveLocalStream}>Leave</button>
    </div>
  );
};

export default VideoChatManager;