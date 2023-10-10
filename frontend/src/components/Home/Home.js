import React, { } from "react";

import Button from "../UI/Button/Button";
import classes from "./Home.module.css";
//import AuthContext from "../../store/auth-context";
import RoomCardList from "./RoomCardList";
import SideCard from "../UI/SideCard/SideCard";
import { useNavigate } from "react-router-dom";
import ScrollableSideCard from "../UI/SideCard/ScrollableSideCard";

const Home = (props) => {
  //const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const addRoomHandler = (event) => {
    navigate("/new-room");
  };

  return (
    <div className={classes["home-container"]}>
      <div className={classes["side-card"]}>
        <SideCard></SideCard>
      </div>
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
        <ScrollableSideCard title={"TOP HOSTS"}></ScrollableSideCard>
      </div>
    </div>
  );
};

export default Home;
