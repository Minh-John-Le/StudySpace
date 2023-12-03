import React, { useRef, useEffect } from "react";
import ConversationThread from "./ConversationThread";
import classes from "./ConversationBox.module.css";

const ConversationBox = (props) => {
  const scrollableContainerRef = useRef(null);

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    if (scrollableContainerRef.current) {
      const scrollableDiv = scrollableContainerRef.current;
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }
  }, [props.messages]);

  return (
    <React.Fragment>
      <div ref={scrollableContainerRef} className={classes.scrollableCard}>
        {props.messages.map((message, index) => (
          <div key={message.id}>
            <ConversationThread
              writer={message.writer}
              writer_name={message.writer_name}
              writer_avatar_name={message.writer_avatar_name}
              content={message.content}
              created_at={message.created_at}
            />
            <br />
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default ConversationBox;
