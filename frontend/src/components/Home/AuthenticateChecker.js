import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AuthenticateChecker = () => {
  const authToken = Cookies.get("authToken");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/login"); // Corrected the typo in the function name
    }

    const apiUrl = `${backendUrl}/api/auth/validate-token/`;

    async function validateToken() {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        if (!response.ok) {
          navigate("/login");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    validateToken();
  }, [authToken, navigate]);

  return null;
};

export default AuthenticateChecker;
