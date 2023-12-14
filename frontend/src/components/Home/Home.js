import React, { useState, useEffect } from "react";

import classes from "./Home.module.css";
//import AuthContext from "../../store/auth-context";
import RoomCardList from "./RoomCardList";
import { useNavigate } from "react-router-dom";
import ScrollableSideCard from "../UI/SideCard/ScrollableSideCard";
import Cookies from "js-cookie";
import HotTopicSideCard from "../UI/SideCard/HotTopicSideCard";
import SearchBar from "./SearchBar";
import NeonButton from "../UI/Button/NeonButton";
import Card from "../UI/Card/Card";

const Home = (props) => {
  //======================================= VARIABLE ==============================
  //const authCtx = useContext(AuthContext);
  const [topMember, setTopMember] = useState([]); //top members list
  const [topTopic, setTopTopic] = useState([]); // top topic list
  const navigate = useNavigate();
  const authToken = Cookies.get("authToken");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //======================================= Helper function ==============================
  const addRoomHandler = (event) => {
    navigate("/new-room");
  };

  //======================================= GET DATA =====================================
  // Get top topic list
  useEffect(() => {
    const apiUrl = `${backendUrl}/api/database/top-topic/`;

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
    const apiUrl = `${backendUrl}/api/database/top-member/`;

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

  //-------------------------------- Top Host ----------------------------I
  const showTopHostHandler = (event) => {
    event.preventDefault();
    navigate("/top-host");
  };

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
        <Card className={classes["search-button-display"]}>
          <SearchBar></SearchBar>

          <div className={classes["button-group-display"]}>
            <div className={classes["button-display"]}>
              <NeonButton
                buttonText={"+ New Room"}
                onClickHandler={addRoomHandler}
              ></NeonButton>
            </div>
            <div className={classes["button-display"]}>
              <NeonButton
                buttonText={"Top Host"}
                onClickHandler={showTopHostHandler}
              ></NeonButton>
            </div>
          </div>
        </Card>

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
