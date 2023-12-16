import React from "react";
//import { useContext } from "react";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import MainHeader from "./components/MainHeader/MainHeader";
//import AuthContext from "./store/auth-context";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile";
import ProfileSetting from "./components/Profile/ProfileSetting/ProfileSetting";
import Room from "./components/Room/Room";
import UpdateRoom from "./components/Room/UpdateRoomForm/UpdateRoom";
import NewRoom from "./components/Room/NewRoomForm/NewRoom";
import StudyBotCard from "./components/StudyBot/StudyBotCard";
import VideoChatRoom from "./components/VideoChatRoom/VideoChatRoom";
import Navigator from "./components/Navigation/Navigator";
import TopHost from "./components/TopHost/TopHost";
import RoomMember from "./components/Room/RoomMember/RoomMember";
import UserFollower from "./components/Profile/UserFollowerFollowing/UserFollower";
import UserFollowing from "./components/Profile/UserFollowerFollowing/UserFollowing";

function App() {
  //const ctx = useContext(AuthContext);

  return (
    <Router>
      <React.Fragment>
        <MainHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup></Signup>} />
          <Route path="/user/:id" element={<Profile></Profile>} />
          <Route
            path="/profile-setting"
            element={<ProfileSetting></ProfileSetting>}
          />
          <Route
            path="/user-follower/:userId"
            element={<UserFollower></UserFollower>}
          />
          <Route
            path="/user-following/:userId"
            element={<UserFollowing></UserFollowing>}
          />
          <Route path="/new-room" element={<NewRoom></NewRoom>} />
          <Route path="/room/:id" element={<Room></Room>} />
          <Route
            path="/room-member/:roomId"
            element={<RoomMember></RoomMember>}
          />
          <Route path="/update-room/:id" element={<UpdateRoom></UpdateRoom>} />
          <Route path="/studybot" element={<StudyBotCard></StudyBotCard>} />
          <Route path="/video-chat" element={<VideoChatRoom></VideoChatRoom>} />
          <Route path="/top-host" element={<TopHost></TopHost>} />
        </Routes>
        <br />
        <Navigator></Navigator>
      </React.Fragment>
    </Router>
  );
}

export default App;
