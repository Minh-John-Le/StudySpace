import React from "react";
import Card from "../UI/Card/Card";
import classes from "./VideoChatRoomCard.module.css";
import Avatar from "../UI/Avatar/Avatar";
import { useState } from "react";
import NeonButton from "../UI/Button/NeonButton";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import IconButton from "../UI/Button/IconButton";
import { TbPhoneFilled } from "react-icons/tb";
import { MdModeEdit } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { HiEye } from "react-icons/hi";
import { HiEyeOff } from "react-icons/hi";
import { FaFile } from "react-icons/fa6";
import { FaFileCircleCheck } from "react-icons/fa6";
import { HiRefresh } from "react-icons/hi";

const VideoChatRoomCard = (props) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [invitationCode, setInvitationCode] = useState(props.invitation_uuid);
  const [invitationRemainDuration, setInvitationRemainDuration] = useState(
    props.remaining_duration
  );

  const navigate = useNavigate();

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

  const joinRoom = (event) => {
    event.preventDefault();
    navigate(`/video-chat-room/${props.id}`);
  };

  const editRoomHandler = (event) => {
    event.preventDefault();
    navigate(`/update-video-chat-room/${props.id}`);
  };
  const deleteRoom = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${backendUrl}/api/videochat/videochat-room-manager/${props.id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.ok) {
        props.deleteRoomById(props.id);
        //navigate(`/video-chat`);
      } else {
        // Handle error response
        console.error("Failed to generate a new code");
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error.message);
    }
  };

  const leaveRoom = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${backendUrl}/api/videochat/leave-videochat-room/${props.id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.ok) {
        props.deleteRoomById(props.id);
        //navigate(`/video-chat`);
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

      {/* ======================= Room Button ============================*/}
      {/*--------------------- Big Screen --------------------- */}
      <div className={classes["videocall-button-group"]}>
        <NeonButton onClickHandler={joinRoom} buttonText={"Join Call"} />

        {!props.is_host && (
          <NeonButton onClickHandler={leaveRoom} buttonText={"Leave"} />
        )}

        {props.is_host && (
          <NeonButton onClickHandler={editRoomHandler} buttonText={"Edit"} />
        )}
        {props.is_host && (
          <NeonButton onClickHandler={deleteRoom} buttonText={"Delete"} />
        )}
      </div>
      {/*--------------------- Small Screen --------------------- */}
      <div className={classes["videocall-button-group-alt"]}>
        <IconButton onClickHandler={joinRoom} icon={TbPhoneFilled} />

        {!props.is_host && (
          <IconButton onClickHandler={leaveRoom} icon={TiDelete} />
        )}

        {props.is_host && (
          <IconButton onClickHandler={editRoomHandler} icon={MdModeEdit} />
        )}
        {props.is_host && (
          <IconButton onClickHandler={deleteRoom} icon={TiDelete} />
        )}
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

            {invitationRemainDuration && (
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

            {/* ======================= Room Code Button ============================*/}
            {/* ----------------------- Big Screen ----------------------------*/}
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

            {/* ----------------------- Small Screen ----------------------------*/}
            <div className={classes["invitation-button-group-alt"]}>
              <IconButton
                onClickHandler={copyToClipboard}
                icon={isCopied ? FaFileCircleCheck : FaFile}
              />
              <IconButton
                onClickHandler={toggleCodeVisibility}
                icon={isCodeVisible ? HiEyeOff : HiEye}
              />
            </div>

            <div className={classes["invitation-button-group-alt"]}>
              <IconButton onClickHandler={generateNewCode} icon={HiRefresh} />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VideoChatRoomCard;
