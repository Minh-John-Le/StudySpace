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
  const topic = searchParams.get("topic");
  const pageParam = searchParams.get("page");

  // Parse the 'page' parameter to an integer
  const pageNumberFromQueryParam = parseInt(pageParam) || 1;

  // Update the page number from the URL
  useEffect(() => {
    setPageNumberFromURL(pageNumberFromQueryParam);
  }, [pageNumberFromQueryParam]);

  // Event handler to handle form submission when Enter is pressed
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    const newPageNumber = parseInt(pageNumberInput);
    if (!isNaN(newPageNumber)) {
      navigate(`/?topic=${topic}&page=${newPageNumber}`);
    }
  };

  // Event handler to increment the page number
  const handleIncrement = () => {
    const newPageNumber = pageNumberFromURL + 1;
    setPageNumberInput(newPageNumber);
    navigate(`/?topic=${topic}&page=${newPageNumber}`);
  };

  // Event handler to decrement the page number
  const handleDecrement = () => {
    if (pageNumberFromURL > 1) {
      const newPageNumber = pageNumberFromURL - 1;
      setPageNumberInput(newPageNumber);
      navigate(`/?topic=${topic}&page=${newPageNumber}`);
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
