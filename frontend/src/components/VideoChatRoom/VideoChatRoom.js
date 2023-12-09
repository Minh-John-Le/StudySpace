import React from "react";

const VideoChatRoom = () => {
  const apiKey = process.env.REACT_APP_AGORA_APP_ID;
  const test = "Hi";
  console.log(apiKey);

  return (
    <React.Fragment>
      <h2>Hello</h2>
      <h2>{apiKey}</h2>
      <h2>{test}</h2>

      <h2>{test}</h2>
    </React.Fragment>
  );
};

export default VideoChatRoom;
