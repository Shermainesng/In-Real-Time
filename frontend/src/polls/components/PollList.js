import React, { useEffect, useState, useReducer } from "react";
import Poll from "./Poll";
import "./Polls.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useCustomContext } from "../../shared/context/CustomContext";

export default function PollList(props) {
  const { pollState, pollDispatch } = useCustomContext();

  console.log("polllist.js state");
  console.log(pollState.polls);

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
        {pollState.polls &&
          pollState.polls.events.map((poll) => (
            <div onClick={() => handleSelectPoll(poll)} key={poll.id}>
              <Poll poll={poll} />
            </div>
          ))}
        {pollState.polls && pollState.polls.events.length === 0 && (
          <div>No polls. Add polls now</div>
        )}
      </div>
    </div>
  );
}
