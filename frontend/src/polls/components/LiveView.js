import React, { useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import { GlobalContext } from "../../shared/context/ContextProvider";
import { Link } from "react-router-dom";

export default function LiveView({ eventId }) {
  // const { pollState, pollDispatch } = useCustomContext();
  const { globalState } = useContext(GlobalContext);

  let selectedPoll;
  if (globalState.selectedPoll !== null) {
    selectedPoll = globalState.selectedPoll;
    console.log("selected poll in LiveView", selectedPoll);
  }

  //when click on 'activate poll' to launch poll, <liveView> will show the selected poll and results
  //when click on share link, user will go to '/events/:eventId/vote'
  //whenever we select a different poll to launch, <Vote> will access that selected poll and render that poll for users to vote
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
            <Link to={{ pathname: `/events/${eventId}/vote` }}>
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
