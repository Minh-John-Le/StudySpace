import React, { useContext } from "react";

import Card from "../UI/Card/Card";
import Button from "../UI/Button/Button";
import classes from "./Home.module.css";
import AuthContext from "../../store/auth-context";
import RoomCard from "./RoomCard";
import RoomCardList from "./RoomCardList";
import RoomPagination from "./RoomPagination";
import SideCard from "../Profile/SideCard";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const addRoomHandler = (event) => {
    navigate("/add-room");
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
        <SideCard title={"TOP HOSTS"}></SideCard>
      </div>
    </div>
  );
};

export default Home;
