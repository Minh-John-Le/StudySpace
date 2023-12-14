import React from "react";
import HostInfoCard from "./HostInfoCard";
import classes from "./TopHost.module.css";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const TopHost = () => {
  const [topMemberList, setTopMemberList] = useState([]); //top members list
  // const navigate = useNavigate();

  const authToken = Cookies.get("authToken");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const apiUrl = `${backendUrl}/api/database/top-50-member/`;

    async function fetchTopMember() {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {},
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const profile = await response.json();
        setTopMemberList(profile);
        console.log(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    fetchTopMember(); // Call the function here if authToken is available
  }, [authToken]);

  return (
    <React.Fragment>
      <div className={classes["host-info-card-group"]}>
        {topMemberList &&
          topMemberList.map((user, index) => (
            <HostInfoCard
              rank={index + 1}
              key={user.profile_id}
              profile_id={user.profile_id}
              avatar_name={user.avatar_name}
              display_name={user.display_name}
              follower_count={user.follower_count}
            />
          ))}
      </div>
    </React.Fragment>
  );
};

export default TopHost;
