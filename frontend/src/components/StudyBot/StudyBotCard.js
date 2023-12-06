import React, { useState, useEffect } from "react";
import classes from "./StudyBotCard.module.css";
import Card from "../UI/Card/Card";
import StudyBotConversationBox from "./StudyBotConversationBox";
import PromptForm from "./PromptForm";
import Cookies from "js-cookie";
import OCRConverter from "./OCRConverter";
import ActionButton from "./ActionButton";

const StudyBotCard = () => {
  const [allQA, setAllQA] = useState([]);
  const authToken = Cookies.get("authToken");

  function formatCreatedAt(created_at) {
    const date = new Date(created_at);
    // Convert to local time
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );

    const formattedDate = localDate.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedDate;
  }

  const addNewQA = (qa) => {
    const formattedQA = {
      ...qa,
      created_at: formatCreatedAt(qa.created_at),
    };

    setAllQA((prevAllQA) => [formattedQA, ...prevAllQA]);
  };

  useEffect(() => {
    fetchAllQA(authToken);
  }, [authToken]);

  async function fetchAllQA(authToken) {
    const apiUrl = `http://localhost:8000/api/chatbot/`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const allQA = await response.json();

      // Format the created_at property for each message
      const formattedQAs = allQA.map((qa) => ({
        ...qa,
        created_at: formatCreatedAt(qa.created_at), // Replace formatCreatedAt with your formatting logic
      }));

      setAllQA(formattedQAs);
    } catch (error) {
      console.error("Error fetching follow status:", error);
    }
  }

  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h3>StudyBot</h3>
      </Card>

      <Card className={classes.body}>
        <div className={classes["bot-note"]}>
          NOTE: StudyBot will only display 10 most recent Q&A while this website
          is still in beta.
        </div>
        <StudyBotConversationBox allQA={allQA}></StudyBotConversationBox>
        <PromptForm addNewQA={addNewQA}></PromptForm>
        <ActionButton></ActionButton>
      </Card>
    </React.Fragment>
  );
};

export default StudyBotCard;
