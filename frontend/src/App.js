import React, { useContext } from "react";

import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import MainHeader from "./components/MainHeader/MainHeader";
import AuthContext from "./store/auth-context";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile";
import ProfileSetting from "./components/Profile/ProfileSetting";

function App() {
  const ctx = useContext(AuthContext);

  return (
    <Router>
      <MainHeader />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup></Signup>} />
          <Route path="/user/:id" element={<Profile></Profile>} />
          <Route path="/profile-setting" element={<ProfileSetting></ProfileSetting>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
