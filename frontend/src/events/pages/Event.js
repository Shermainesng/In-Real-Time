import React, { useReducer, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import MultipleChoiceForm from "../../polls/components/MultipleChoiceForm";
import "./Event.css";
import EventPageContent from "../components/EventPageContent";
import CustomContext from "../../shared/context/CustomContext";
import FreeTextPoll from "../../polls/components/FreeTextPoll";

function reducer(state, action) {
  switch (action.type) {
    case "SET_POLLS":
      return {
        ...state,
        polls: action.payload.polls, // Update the polls property
      };
    case "ADD_POLL":
      return { ...state, polls: [...state.polls, action.payload] };
    case "UPDATE_POLL":
      const updatedPollIndex = state.polls.findIndex(
        (poll) => poll.id === action.payload._id
      );
      if (updatedPollIndex !== -1) {
        const updatedPolls = [...state.polls];
        updatedPolls[updatedPollIndex] = action.payload;
        return { ...state, polls: updatedPolls };
      } else {
        return { ...state, polls: [...state.polls, action.payload] };
      }
    case "DELETE_POLL":
      const filteredPolls = state.polls.filter(
        (poll) => poll.id !== action.payload
      );
      return { ...state, polls: filteredPolls };
    case "SELECT_POLL":
      return {
        ...state,
        selectedPoll: action.payload,
      };
    default:
      return state;
  }
}

export default function Event() {
  const [pollState, pollDispatch] = useReducer(reducer, {
    polls: [],
    selectedPoll: null,
  });

  const providerState = {
    pollState,
    pollDispatch,
  };

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [event, setEvent] = useState({});
  const [showNewPoll, setShowNewPoll] = useState(false);
  const [selectedPollType, setSelectedPollType] = useState("");
  const eventId = useParams().eventId;

  //getting event object
  useEffect(() => {
    const getEvent = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/${eventId}/polls`
        );
        const eventData = responseData.event;
        setEvent(eventData);
      } catch (err) {}
    };
    getEvent();
  }, []);

  //set initial state of polls
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + `/polls/${eventId}`
        );
        const data = await response.json();
        pollDispatch({
          type: "SET_POLLS",
          payload: {
            ...pollState,
            polls: data.events,
          },
        });
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };
    fetchPolls();
  }, []);

  //will run when pollState changes
  // useEffect(() => {
  //   console.log("Pollstate in Event.js", pollState.polls);
  // }, [pollState]);

  const handleSelection = (selected) => {
    setSelectedPollType(selected);
    setShowNewPoll(true);
  };

  return (
    <CustomContext.Provider value={providerState}>
      <div className="fixed top-0 left-0 h-screen w-full bg-purple px-10 sm:px-20 md:px-30 relative items-center">
        <div>{event.name}</div>
        <div className="dropdown dropdown-hover">
          <div>
            <label tabIndex={0} className="btn m-1">
              <button className="border-2 text-navy-blue border-navy-blue bg-bright-yellow px-4">
                Add a poll
              </button>
            </label>
          </div>
          <div>
            <ul
              tabIndex={0}
              className="absolute z-10 dropdown-content bg-white text-navy-blue menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li onClick={() => handleSelection("Multiple Choice")}>
                <a>Multiple Choice</a>
              </li>
              <li onClick={() => handleSelection("Free Text")}>
                <a>Free Text</a>
              </li>
            </ul>
          </div>
        </div>
        {/* to render EventPageContent when polls updated */}
        {<EventPageContent eventId={eventId} />}
        {selectedPollType === "Multiple Choice" && showNewPoll && (
          <div className="overlay">
            <div className="w-2/3 lg:w-1/3 px-3 text-left">
              <MultipleChoiceForm setShowNewPoll={setShowNewPoll} />
            </div>
          </div>
        )}
        {selectedPollType === "Free Text" && showNewPoll && (
          <div className="overlay">
            <div className="w-2/3 lg:w-1/3 px-3 text-left">
              <FreeTextPoll setShowNewPoll={setShowNewPoll} />
            </div>
          </div>
        )}
      </div>
    </CustomContext.Provider>
  );
}
