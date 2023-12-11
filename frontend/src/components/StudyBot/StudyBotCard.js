import React, { useState, useEffect } from "react";
import classes from "./StudyBotCard.module.css";
import Card from "../UI/Card/Card";
import StudyBotConversationBox from "./StudyBotConversationBox";
import PromptForm from "./PromptForm";
import Cookies from "js-cookie";
import AuthenticateChecker from "../Home/AuthenticateChecker";

const StudyBotCard = () => {
  //=============================== VARIABLES ===================================
  //--------------------------------- Q&A --------------------------------
  const [allQA, setAllQA] = useState([]);

  //--------------------------------- API --------------------------------
  const authToken = Cookies.get("authToken");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //=============================== FUNCTIONS ===================================
  //------------------------------ HELPER FUNCTION---------------------------------
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

  //------------------------------ Getting Data --------------------------------
  useEffect(() => {
    fetchAllQA(authToken);
  }, [authToken]);

  async function fetchAllQA(authToken) {
    const apiUrl = `${backendUrl}/api/chatbot/`;

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

  //=============================== RETURN COMPONENTS ===================================
  return (
    <React.Fragment>
      <AuthenticateChecker></AuthenticateChecker>
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
      </Card>
    </React.Fragment>
  );
};

export default StudyBotCard;
