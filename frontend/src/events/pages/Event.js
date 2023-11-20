import React, { useReducer, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import MultipleChoiceForm from "../../polls/components/MultipleChoiceForm";
import "./Event.css";
import EventPageContent from "../components/EventPageContent";
import CustomContext from "../../shared/context/CustomContext";

function reducer(state, action) {
  switch (action.type) {
    case "SET_POLLS":
      return { ...state, polls: action.payload };
    case "ADD_POLL":
      console.log("in add poll", state.polls.events);
      return { ...state, polls: [...state.polls.events, action.payload] };
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

  useEffect(() => {
    console.log("getting Event info now");
    const getEvent = async () => {
      try {
        const responseData = await sendRequest(
          // `http://localhost:7005/api/events/${eventId}/polls`
          process.env.REACT_APP_BACKEND_URL + `/${eventId}/polls`
        );
        const eventData = responseData.event;
        console.log("event.js" + eventData.name);
        setEvent(eventData);
      } catch (err) {}
    };
    getEvent();
  }, []);

  useEffect(() => {
    console.log("Polls have been updated:", pollState.polls);
  }, [pollState.polls]);

  const handleSelection = (selected) => {
    setSelectedPollType(selected);
    setShowNewPoll(true);
  };

  return (
    <CustomContext.Provider value={providerState}>
      <div className="fixed top-0 left-0 h-screen w-full bg-purple px-10 sm:px-20 md:px-30 relative items-center">
        {selectedPollType === "Multiple Choice" && showNewPoll && (
          <MultipleChoiceForm setShowNewPoll={setShowNewPoll} />
        )}
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
        {!showNewPoll && <EventPageContent eventId={eventId} />}
      </div>
    </CustomContext.Provider>
  );
}
