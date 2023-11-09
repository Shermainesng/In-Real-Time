import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import MultipleChoiceForm from "../../polls/components/MultipleChoiceForm";
import "./Event.css";
import PollList from "../../polls/components/PollList";
import LiveView from "../../polls/components/LiveView";
import { StateProvider } from "../../shared/context/StateContext";
import reducer, { initialState } from "../../shared/reducers/poll-reducer";
import EventPageContent from "../components/EventPageContent";

export default function Event() {
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
          `http://localhost:7005/api/events/${eventId}/polls`
        );
        const eventData = responseData.event;
        console.log("event.js" + eventData.name);
        setEvent(eventData);
      } catch (err) {}
    };
    getEvent();
  }, []);

  console.log("now in Event.js" + eventId);

  const handleSelection = (selected) => {
    setSelectedPollType(selected);
    setShowNewPoll(true);
  };

  return (
    // <StateProvider initialState={initialState} reducer={reducer}>
    <div className="fixed top-0 left-0 h-screen w-full bg-purple px-10 sm:px-20 md:px-30 relative items-center">
      {selectedPollType === "Multiple Choice" && showNewPoll && (
        <MultipleChoiceForm setShowNewPoll={setShowNewPoll} />
      )}
      <div>{event.name}</div>

      <div className="dropdown dropdown-hover">
        <div>
          <label tabIndex={0} className="btn m-1">
            Hover
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

      <EventPageContent eventId={eventId} />
    </div>
    // </StateProvider>
  );
}
