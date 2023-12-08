import React, { useReducer, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import MultipleChoiceForm from "../../polls/components/MultipleChoiceForm";
import "./Event.css";
import EventPageContent from "../components/EventPageContent";
import CustomContext from "../../shared/context/CustomContext";

function reducer(state, action) {
  switch (action.type) {
    case "SET_POLLS":
      return {
        ...state,
        polls: action.payload.polls, // Update the polls property
      };
    case "ADD_POLL":
      return { ...state, polls: [...state.polls, action.payload] };
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
        console.log("event.js" + eventData.name);
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
        console.log("fetching polls in EVENT.JS");
        console.log(data);
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
  useEffect(() => {
    console.log("Pollstate in Event.js", pollState.polls);
  }, [pollState]);

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
          <MultipleChoiceForm setShowNewPoll={setShowNewPoll} />
        )}
      </div>
    </CustomContext.Provider>
  );
}
