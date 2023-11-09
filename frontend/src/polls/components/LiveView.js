import React, { useEffect, useState } from "react";
import { useCustomContext } from "../../shared/context/CustomContext";

export default function LiveView() {
  const { pollState, pollDispatch } = useCustomContext();
  console.log(pollState.selectedPoll);

  let selectedPoll;
  if (pollState.selectedPoll !== null) {
    selectedPoll = pollState.selectedPoll;
  }

  return (
    <div className="z-0 relative card flex-1 card bg-base-100 shadow-xl custom-max-height-70">
      <div className="card-body">
        <h1>Launch your poll to gather responses</h1>
        <p>Your event is now active</p>
        <p>
          Once you launch the poll, your participants can now vote with the link
          below
        </p>
        {selectedPoll && (
          <div className="selected-poll">
            <h2>{selectedPoll.question}</h2>
          </div>
        )}
      </div>
    </div>
  );
}
