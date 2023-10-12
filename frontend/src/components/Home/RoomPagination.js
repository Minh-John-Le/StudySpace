import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import classes from "./RoomPagination.module.css";

const RoomPagination = (props) => {
  // State to store the page number from the URL
  const [pageNumberFromURL, setPageNumberFromURL] = useState(1);

  // State to store the page number in the input field
  const [pageNumberInput, setPageNumberInput] = useState(1);

  const navigate = useNavigate();

  // Parse the search parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Extract the 'topic' and 'page' parameters from the URL
  let topic = searchParams.get("topic");
  if (topic === null) {
    topic = "";
  }
  const pageParam = searchParams.get("page");

  // Parse the 'page' parameter to an integer
  const pageNumberFromQueryParam = parseInt(pageParam) || 1;

  // Update the page number from the URL
  useEffect(() => {
    setPageNumberInput(pageNumberFromQueryParam);
    setPageNumberFromURL(pageNumberFromQueryParam);
  }, [pageNumberFromQueryParam]);

  // Event handler to handle form submission when Enter is pressed
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
    console.log(props.max_page);
    console.log(newPageNumber);
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
    <div>
      <form onSubmit={handleFormSubmit}>
        <div className={classes.pagination}>
          <button type="button" onClick={handleDecrement}>
            {"<"}
          </button>
          <input
            type="number"
            id="page"
            min="1"
            step="1"
            value={pageNumberInput}
            onChange={(event) => {
              const newPageNumber = parseInt(event.target.value);
              if (!isNaN(newPageNumber)) {
                setPageNumberInput(newPageNumber);
              }
            }}
          />
          <button type="button" onClick={handleIncrement}>
            {">"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomPagination;
