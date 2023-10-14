import React, { useRef, useEffect } from "react";
import CardScrollbar from "../UI/Card/ScrollableCard";
import ConversationThread from "./ConversationThread";

const ConversationBox = (props) => {
  const scrollableContainerRef = useRef(null);

  // Scroll to the bottom whenever new messages are added
  // useEffect(() => {
  //   if (scrollableContainerRef.current) {
  //     scrollableContainerRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "end",
  //     });
  //   }
  //   // To prevent the parent or browser window from scrolling, set its scroll position back to the current value
  // }, [props.messages]);

  return (
    <React.Fragment>
      <CardScrollbar>
        {props.messages.map((message, index) => (
          <div key={message.id}>
            <ConversationThread
              writer={message.writer}
              writer_name={message.writer_name}
              writer_avatar_name={message.writer_avatar_name}
              content={message.content}
              created_at={message.created_at}
            ></ConversationThread>
            <br></br>
          </div>
        ))}
      </CardScrollbar>
    </React.Fragment>
  );
};

export default ConversationBox;
