import React, { useEffect, useState } from "react";
import Card from "../UI/Card/Card";
import { useParams } from "react-router-dom";
import classes from "./EmailVerification.module.css";

const EmailVerification = () => {
  const [isValidToken, setIsValidToken] = useState(null);

  //----------------------- API --------------------------------------
  const { secToken } = useParams();
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //=============================== FUNCTIONS =================================
  useEffect(() => {
    console.log(secToken);
    async function verifyEmail() {
      try {
        // Send a POST request to your backend login endpoint
        const apiUrl = `${backendUrl}/api/auth/verify-email/`;
        const content = { token_value: secToken, token_type: "email_verify" };

        const response = await fetch(apiUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(content),
        });

        if (!response.ok) {
          // Handle login error here (e.g., show an error message)
          setIsValidToken(false);
          console.error("Invalid token");
          return;
        }

        setIsValidToken(true);
      } catch {
        setIsValidToken(false);
      }
    }
    if (secToken) {
      verifyEmail();
    }
  }, [secToken, backendUrl]);

  return (
    <div className={classes["general-layout"]}>
      <Card className={classes["message-card"]}>
        {!isValidToken && (
          <div className={classes["error"]}>
            Opps the verification link might be expired!!
          </div>
        )}
        {isValidToken && (
          <div className={classes["success"]}>
            Successfully verify your email!
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmailVerification;
