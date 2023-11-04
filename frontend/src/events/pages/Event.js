import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import MultipleChoiceForm from "../../polls/components/MultipleChoiceForm";

export default function Event() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [event, setEvent] = useState({});
  const [showNewPoll, setShowNewPoll] = useState(false);
  const [selectedPollType, setSelectedPollType] = useState("");
  const eventId = useParams().eventId;

  useEffect(() => {
    const getEvent = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:7005/api/events/${eventId}/polls`
        );
        console.log("this is it");
        const eventData = responseData.event;
        console.log(eventData.name);
        setEvent(eventData);
      } catch (err) {}
    };
    getEvent();
  }, [sendRequest]);

  const handleSelection = (selected) => {
    setSelectedPollType(selected);
    setShowNewPoll(true);
  };

  return (
    <div className="h-screen relative">
      <div className="bg-purple px-40 absolute inset-0 items-center">
        <div>{event.name}</div>

        <div className="dropdown dropdown-hover">
          <label tabIndex={0} className="btn m-1">
            Hover
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] bg-white text-navy-blue menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li onClick={() => handleSelection("Multiple Choice")}>
              <a>Multiple Choice</a>
            </li>
            <li onClick={() => handleSelection("Free Text")}>
              <a>Free Text</a>
            </li>
          </ul>
        </div>
        <p>{selectedPollType}</p>
        {selectedPollType === "Multiple Choice" && showNewPoll && (
          <MultipleChoiceForm />
        )}
        {/* {selectedPollType === "Free Text" && showNewPoll && (
          <MultipleChoiceForm />
        )} */}
      </div>
    </div>
  );
}
