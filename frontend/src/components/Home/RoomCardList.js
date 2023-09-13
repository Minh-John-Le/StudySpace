import React from "react";
import RoomCard from "./RoomCard";

const RoomCardList = () => {
  return (
    <div>
      <RoomCard
        host={"john"}
        totalMember={"100"}
        title={"Django Backend Discusion"}
        topic={"Djano"}
      ></RoomCard>
      <RoomCard
        host={"john"}
        totalMember={"100"}
        title={"Django Backend Discusion"}
        topic={"Djano"}
      ></RoomCard>
    </div>
  );
};

export default RoomCardList;
