import React from "react";
import JoinRoomForm from "./JoinRoomForm";
import VideoChatRoomCardList from "./VideoChatRoomCardList";

const VideoChat = () => {
  return (
    <div>
      <JoinRoomForm></JoinRoomForm>
      <VideoChatRoomCardList></VideoChatRoomCardList>
    </div>
  );
};

export default VideoChat;
