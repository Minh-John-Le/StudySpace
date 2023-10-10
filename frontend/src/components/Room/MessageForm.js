import React from "react";
import classes from "./MessageForm.module.css";
import { GoSearch } from "react-icons/go";
import Card from "../UI/Card/Card";
const MessageForm = () => {
  const handleFormSubmit = (event) => {};
  return (
    <Card>
      <form onSubmit={handleFormSubmit}>
        <div className={classes["message-box"]}>
          <input type="text" id="search" placeholder="Write Your Message Here" />
        </div>
      </form>
    </Card>
  );
};

export default MessageForm;
