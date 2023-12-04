import React from "react";
import classes from "./StudyBotConversationBox.module.css";
import { useRef, useEffect } from "react";
import QAThread from "./QAThread";

const StudyBotConversationBox = (props) => {
  const scrollableContainerRef = useRef(null);

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    if (scrollableContainerRef.current) {
      const scrollableDiv = scrollableContainerRef.current;
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }
  }, [props.allQA]);

  return (
    <React.Fragment>
      <div ref={scrollableContainerRef} className={classes.scrollableCard}>
        {props.allQA
          .slice()
          .reverse()
          .map((qa, index) => (
            <div key={qa.id}>
              <QAThread
                writer={qa.writer}
                writer_name={qa.writer_name}
                writer_avatar_name={qa.writer_avatar_name}
                message={qa.message}
                created_at={qa.created_at}
                response={qa.response}
              />
              <br />
            </div>
          ))}
      </div>
    </React.Fragment>
  );
};

export default StudyBotConversationBox;
