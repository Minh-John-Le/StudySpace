import React, { useState, useEffect } from "react";

import Button from "../UI/Button/Button";
import classes from "./Home.module.css";
//import AuthContext from "../../store/auth-context";
import RoomCardList from "./RoomCardList";
import SideCard from "../UI/SideCard/SideCard";
import { useNavigate } from "react-router-dom";
import ScrollableSideCard from "../UI/SideCard/ScrollableSideCard";
import Cookies from "js-cookie";

const Home = (props) => {
  //const authCtx = useContext(AuthContext);
  const [topMember, setTopMember] = useState([]);
  const navigate = useNavigate();

  const addRoomHandler = (event) => {
    navigate("/new-room");
  };
  const authToken = Cookies.get("authToken");

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

  return (
    <div className={classes["home-container"]}>
      <div className={classes["side-card"]}></div>
      <div className={classes["room"]}>
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
