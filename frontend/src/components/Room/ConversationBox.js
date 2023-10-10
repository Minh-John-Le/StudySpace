import React from "react";
import CardScrollbar from "../UI/Card/ScrollableCard";
import ConversationThread from "./ConversationThread";

const ConversationBox = (props) => {
  return (
    <React.Fragment>
      <CardScrollbar>
        {props.messages.map((message, index) => (
          <div>
            <ConversationThread
              key={message.id}
              writer={message.writer}
              writer_name={message.writer_name}
              writer_image_url={message.writer_image_url}
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
