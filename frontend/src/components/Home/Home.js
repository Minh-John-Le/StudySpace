import React, { useState, useEffect } from "react";

import Button from "../UI/Button/Button";
import classes from "./Home.module.css";
//import AuthContext from "../../store/auth-context";
import RoomCardList from "./RoomCardList";
import { useNavigate } from "react-router-dom";
import ScrollableSideCard from "../UI/SideCard/ScrollableSideCard";
import Cookies from "js-cookie";
import HotTopicSideCard from "../UI/SideCard/HotTopicSideCard";
import SearchBar from "./SearchBar";
const Home = (props) => {
  //======================================= VARIABLE ==============================
  //const authCtx = useContext(AuthContext);
  const [topMember, setTopMember] = useState([]); //top members list
  const [topTopic, setTopTopic] = useState([]); // top topic list
  const navigate = useNavigate();
  const authToken = Cookies.get("authToken");

  //======================================= Helper function ==============================
  const addRoomHandler = (event) => {
    navigate("/new-room");
  };

  //======================================= GET DATA =====================================
  // Get top topic list
  useEffect(() => {
    const apiUrl = `http://localhost:8000/api/database/top-topic/`;

    async function fetchTopTopic() {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {},
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const topicRs = await response.json();
        setTopTopic(topicRs);
      } catch (error) {
        console.error("Error fetching topic:", error);
      }
    }

    fetchTopTopic(); // Call the function here if authToken is available
  }, [authToken]);

  // Get top member list
  useEffect(() => {
    const apiUrl = `http://localhost:8000/api/database/top-member/`;

    async function fetchTopMember() {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {},
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const profile = await response.json();
        setTopMember(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    fetchTopMember(); // Call the function here if authToken is available
  }, [authToken]);

  //======================================= RETURN COMPONENT =====================================
  return (
    <div className={classes["home-container"]}>
      <div className={classes["side-card"]}>
        <HotTopicSideCard
          title={"HOT TOPICS"}
          data={topTopic}
        ></HotTopicSideCard>
      </div>
      <div className={classes["room"]}>
        <SearchBar></SearchBar>
        <div className={classes.actions}>
          <Button
            type="button"
            className={classes.btn}
            onClick={addRoomHandler}
          >
            <div>+ New Room</div>
          </Button>
        </div>
        <RoomCardList></RoomCardList>
      </div>
      <div className={classes["side-card"]}>
        <ScrollableSideCard
          title={"TOP HOSTS"}
          data={topMember}
        ></ScrollableSideCard>
      </div>
    </div>
  );
};

export default Home;
