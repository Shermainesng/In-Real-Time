import React, { useEffect, useState, useReducer } from "react";
import Poll from "./Poll";
import "./Polls.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useCustomContext } from "../../shared/context/CustomContext";
import LiveView from "./LiveView";

export default function PollList(props) {
  const { pollState, pollDispatch } = useCustomContext();
  const [localPolls, setLocalPolls] = useState([]);

  useEffect(() => {
    setLocalPolls(pollState.polls || []);
  }, [pollState]);

  const handleSelectPoll = (selectedPoll) => {
    console.log(selectedPoll);
    pollDispatch({
      type: "SELECT_POLL",
      payload: selectedPoll,
    });
  };
  return (
    <div className="z-0 relative card flex-1 card bg-base-100 shadow-xl custom-max-height-70 overflow-y-auto">
      <div className="card-body">
        {localPolls.length > 0 &&
          localPolls.map((poll) => (
            <div onClick={() => handleSelectPoll(poll)} key={poll.id}>
              <Poll poll={poll} />
            </div>
          ))}
      </div>
    </div>
  );
}
