import React from "react";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import UserCard from "../../UI/User/UserCard";
import Card from "../../UI/Card/Card";
import { Link } from "react-router-dom";
import UserFollowingPagination from "./UserFollowingPagination";
import classes from "./UserFollower.module.css";

const UserFollowing = () => {
  const [data, setData] = useState([]); // all rooms
  const [maxPage, setMaxPage] = useState(1); // max page
  const [userMetaContent, setUserMetaContent] = useState([]);

  //--------------------------------- API--------------------------------------
  const authToken = Cookies.get("authToken");
  const { userId } = useParams();
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  //===================================== PREPARE TOPIC AND PAGE================================
  // Get the current location object
  const location = useLocation();

  // Parse the search parameters
  const searchParams = new URLSearchParams(location.search);

  let page = searchParams.get("page");

  if (page === null) {
    page = "1";
  }

  //===================================== GET DATA ================================
  // Url for room match topic and page
  const apiUrl = `${backendUrl}/api/database/user-following/${userId}/?page=${page}`;

  useEffect(() => {
    async function fetchAllMemberHandler() {
      try {
        const headers = {
          Authorization: `Token ${authToken}`, // Include the authentication token
        };

        const response = await fetch(apiUrl, { headers });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const allMember = await response.json();

        const formattedMembers = allMember.result?.map((member) => ({
          ...member,
          created_at: formatCreatedAt(member.created_at), // Replace formatCreatedAt with your formatting logic
        }));

        setData(formattedMembers || []);
        setMaxPage(allMember.max_page);
      } catch (error) {
        // Handle errors here, e.g., display an error message
        console.error("Error fetching data:", error);
      }
    }

    fetchAllMemberHandler();
  }, [page, apiUrl, authToken]);

  // Get the user info (meta info) for the first time
  useEffect(() => {
    async function fetchData() {
      const apiUrl = `${backendUrl}/api/auth/user/${userId}/`;

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const roomMetaContent = await response.json();
        setUserMetaContent(roomMetaContent);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    if (authToken) {
      fetchData(); // Call the function here if authToken is available
    }
  }, [authToken, userId]);

  function formatCreatedAt(created_at) {
    const date = new Date(created_at);

    // Set the time zone to 'GMT+7'
    const options = {
      timeZone: "Etc/GMT+7",
      year: "numeric",
      month: "short",
      day: "2-digit",
    };

    // Use toLocaleString with the specified time zone options
    const formattedDate = date.toLocaleString("en-US", options);
    return formattedDate;
  }

  return (
    <React.Fragment>
      <Card className={classes["user-name-display"]}>
        <h2>{`${"Following of"}`}</h2>
        <Link
          to={"/user/" + userMetaContent.user}
          className={classes["user-name-link"]}
        >
          <h2>{`"${userMetaContent.display_name}"`}</h2>
        </Link>
      </Card>

      <div className={classes["user-card-group"]}>
        {data.map((data, index) => (
          <UserCard
            rank={index + 1}
            key={data.profile_id}
            profile_id={data.profile_id}
            avatar_name={data.avatar_name}
            display_name={data.display_name}
            created_at={data.created_at}
          />
        ))}
      </div>

      {data.length !== 0 && maxPage > 1 && (
        <UserFollowingPagination max_page={maxPage}></UserFollowingPagination>
      )}
    </React.Fragment>
  );
};

export default UserFollowing;
