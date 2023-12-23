import React from "react";
import Card from "../UI/Card/Card";
import classes from "./VideoChatRoomCard.module.css";
import Avatar from "../UI/Avatar/Avatar";
import { useState } from "react";
import NeonButton from "../UI/Button/NeonButton";
import Cookies from "js-cookie";
const VideoChatRoomCard = (props) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [invitationCode, setInvitationCode] = useState(props.invitation_uuid);
  const [invitationRemainDuration, setInvitationRemainDuration] = useState(
    props.remaining_duration
  );

  //----------------------------------- API ----------------------------------
  const authToken = Cookies.get("authToken");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //====================== FUNTIONS ============================
  const generateNewCode = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/videochat/videochat-invitation-update/${props.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`, // Replace YOUR_AUTH_TOKEN with the actual authentication token
          },
        }
      );

      if (response.ok) {
        const newCode = await response.json();
        setInvitationCode(newCode.invitation_uuid);
        setInvitationRemainDuration(newCode.remaining_duration);

        console.log("New code generated successfully");
      } else {
        // Handle error response
        console.error("Failed to generate a new code");
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationCode);
    setIsCopied(true);

    // Reset the button text to its original state after 3 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const toggleCodeVisibility = () => {
    setIsCodeVisible(!isCodeVisible);
  };
  return (
    <Card className={classes["roomcard"]}>
      <div className={classes["roomcard-header"]}>
        <div className={classes["roomcard-header-left"]}>
          <Avatar
            displayName={`Host @${props.host}`}
            avatarName={props.host_avatar_name}
            avatarLink={"/user/" + props.host_id}
            includeDisplayName={true}
            displayNameClassName={classes["avatar__display-name"]}
            avatarLinkClassName={classes["avatar__link"]}
          />
        </div>
        <div className={classes["roomcard-header-right"]}>
          <span>{props.created_ago} ago</span>
        </div>
      </div>
      <div className={classes["roomcard__room_name"]}>{props.room_name}</div>
      {/* ======================= Join Call Room ============================*/}
      <div className={classes["videocall-button-group"]}>
        <NeonButton onClickHandler={copyToClipboard} buttonText={"Join Call"} />
      </div>

      {/* ======================= Invitation Code ============================*/}
      {props.is_host && (
        <div className={classes["invitation-box"]}>
          <p>Invitation Code:</p>
          <div className={classes["invitation-code-container"]}>
            {isCodeVisible ? (
              <div className={classes["invitation-code"]}>{invitationCode}</div>
            ) : (
              <div className={classes["invitation-code"]}>
                {"#####-##########-#########-########"}
              </div>
            )}

            {props.remaining_duration && (
              <div className={classes["remaining-duration"]}>
                {"Expire in "}
                {invitationRemainDuration.days > 0 &&
                  `${invitationRemainDuration.days}d `}
                {invitationRemainDuration.hours > 0 &&
                  `${invitationRemainDuration.hours}h `}
                {invitationRemainDuration.minutes > 0 &&
                  `${invitationRemainDuration.minutes}m`}
              </div>
            )}
            {!invitationRemainDuration && (
              <div className={classes["expire-code"]}>Code has expired</div>
            )}

            <div className={classes["invitation-button-group"]}>
              <NeonButton
                onClickHandler={copyToClipboard}
                buttonText={isCopied ? "Copied!" : "Copy Code"}
              />
              <NeonButton
                onClickHandler={toggleCodeVisibility}
                buttonText={isCodeVisible ? "Hide Code" : "Reveal Code"}
              />
            </div>
            <div className={classes["invitation-button-group"]}>
              <NeonButton
                onClickHandler={generateNewCode}
                buttonText={"New Code"}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VideoChatRoomCard;
