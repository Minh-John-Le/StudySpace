import React, { useState, useEffect } from "react";
import VideoChatRoomCard from "./VideoChatRoomCard";

const VideoChatRoomCardList = (props) => {
  return (
    <div>
      {props.roomList.map((room) => (
        <VideoChatRoomCard
          key={room.id}
          id={room.id}
          host={room.host_display_name}
          host_avatar_name={room.host_avatar_name}
          host_id={room.host}
          created_ago={room.created_ago}
          room_name={room.room_name}
          is_host={room.is_host}
          invitation_uuid={room.invitation_uuid}
          remaining_duration={room.remaining_duration}
          deleteRoomById={props.deleteRoomById}
        />
      ))}
    </div>
  );
};

export default VideoChatRoomCardList;
