import React from "react";
import classes from "./StudyBotCard.module.css";
import Card from "../UI/Card/Card";
import StudyBotConversationBox from "./StudyBotConversationBox";
import PromptForm from "./PromptForm";

const StudyBotCard = () => {
  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h3>StudyBot</h3>
      </Card>

      <Card className={classes.body}>
        <StudyBotConversationBox></StudyBotConversationBox>
        <PromptForm></PromptForm>
      </Card>
    </React.Fragment>
  );
};

export default StudyBotCard;
