import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import classes from "./RoomPagination.module.css";
import PaginationBox from "../UI/Pagination/PaginationBox";

const RoomPagination = (props) => {
  //================================== VARIABLE =====================================
  const [pageNumberFromURL, setPageNumberFromURL] = useState(1); // URL's page
  const [pageNumberInput, setPageNumberInput] = useState(1); // entered page

  const navigate = useNavigate();

  //================================= PREPARE PAGE AND TOPIC=========================
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Extract the 'topic' and 'page' parameters from the URL
  let topic = searchParams.get("topic");
  if (topic === null) {
    topic = "";
  }
  const pageParam = searchParams.get("page");
  const pageNumberFromQueryParam = parseInt(pageParam) || 1;

  //================================= GET DATA=========================
  // Ensure pagination box number will match for both URL and Enter Value
  useEffect(() => {
    setPageNumberInput(pageNumberFromQueryParam);
    setPageNumberFromURL(pageNumberFromQueryParam);
  }, [pageNumberFromQueryParam, topic]);

  // Event handler to handle number submission
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const newPageNumber = Math.min(parseInt(pageNumberInput), props.max_page);
    if (!isNaN(newPageNumber)) {
      navigate(`/?topic=${topic}&page=${newPageNumber}`);
      setPageNumberFromURL(newPageNumber);
    }
  };

  // Event handler to increment the page number
  const handleIncrement = () => {
    const newPageNumber = Math.min(pageNumberFromURL + 1, props.max_page);

    setPageNumberInput(newPageNumber);
    navigate(`/?topic=${topic}&page=${newPageNumber}`);
    setPageNumberFromURL(newPageNumber);
  };

  // Event handler to decrement the page number
  const handleDecrement = () => {
    if (pageNumberFromURL > 1) {
      const newPageNumber = Math.min(pageNumberFromURL - 1, props.max_page);
      setPageNumberInput(newPageNumber);
      navigate(`/?topic=${topic}&page=${newPageNumber}`);
      setPageNumberFromURL(newPageNumber);
    }
  };

  return (
    <PaginationBox
      handleFormSubmit={handleFormSubmit}
      handleDecrement={handleDecrement}
      pageNumberInput={pageNumberInput}
      setPageNumberInput={setPageNumberInput}
      handleIncrement={handleIncrement}
    />
  );
};

export default RoomPagination;
