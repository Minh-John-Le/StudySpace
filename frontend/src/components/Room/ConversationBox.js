import React, { useRef, useEffect, useLayoutEffect } from "react";
import CardScrollbar from "../UI/Card/ScrollableCard";
import ConversationThread from "./ConversationThread";

const ConversationBox = (props) => {
  const scrollableContainerRef = useRef(null);

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      console.log(scrollableContainerRef.current);
      console.log(scrollableContainerRef.current.scrollTop);
      console.log(scrollableContainerRef.current.scrollHeight);
    }
  }, [props.messages]);

  return (
    <React.Fragment>
      <CardScrollbar>
        <div ref={scrollableContainerRef}>
          {props.messages.map((message, index) => (
            <div key={message.id}>
              <ConversationThread
                writer={message.writer}
                writer_name={message.writer_name}
                writer_image_url={message.writer_image_url}
                content={message.content}
                created_at={message.created_at}
              ></ConversationThread>
              <br></br>
            </div>
          ))}
        </div>
      </CardScrollbar>
    </React.Fragment>
  );
};

export default ConversationBox;
