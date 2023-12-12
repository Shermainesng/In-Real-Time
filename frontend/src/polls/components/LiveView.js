import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import { useCustomContext } from "../../shared/context/CustomContext";
import { Link } from "react-router-dom";

export default function LiveView() {
  const { pollState, pollDispatch } = useCustomContext();

  let selectedPoll;
  if (pollState.selectedPoll !== null) {
    selectedPoll = pollState.selectedPoll;
    // console.log("selected poll in LiveView", selectedPoll);
  }

  //auto update of poll when it is edited but LiveView is not re-rendered
  // useEffect(() => {
  //   console.log("hello", pollState.selectedPoll);
  // }, [pollState]);

  return (
    // <div className="relative">
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
            <Link
              to={{
                pathname: `/events/${selectedPoll._id}/vote`,
                state: {
                  question: selectedPoll.question,
                  options: selectedPoll.options ? selectedPoll.options : null,
                  type: selectedPoll.type,
                },
              }}
            >
              <div className="flex flex-col items-center justify-center">
                <QRCode value={`/events/${selectedPoll.id}/vote`} />
                If the QR code doesn't work, use this link to vote:
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
    // </div>
  );
}
