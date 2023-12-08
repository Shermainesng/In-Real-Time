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
    // urlPath = `/events/${selectedPoll.id}/vote`;
  }

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
        {/* <QRCode value="hey" /> */}
        {selectedPoll && (
          <div className="selected-poll">
            <h2>{selectedPoll.question}</h2>
            <Link
              to={{
                pathname: `/events/${selectedPoll.id}/vote`,
                state: {
                  question: selectedPoll.question,
                  options: selectedPoll.options,
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
