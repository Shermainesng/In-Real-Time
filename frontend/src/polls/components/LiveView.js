import React, { useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import { GlobalContext } from "../../shared/context/ContextProvider";
import { Link } from "react-router-dom";
import DisplayResults from "./DisplayResults";
import "./Polls.css";

export default function LiveView({ eventId }) {
  const { globalState } = useContext(GlobalContext);
  const [showResults, setShowResults] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  let selectedPoll;
  if (globalState.selectedPoll !== null) {
    selectedPoll = globalState.selectedPoll;
    console.log("selected poll in LiveView", selectedPoll);
  }

  const generateLink = () => {
    const isProduction = process.env.NODE_ENV === "production";
    const baseUrl = isProduction
      ? "https://in-real-time-frontend.vercel.app/"
      : "http://localhost:3000";
    const link = `${baseUrl}/events/${eventId}/vote`;
    return link;
  };
  const copyLinkToClipboard = () => {
    const link = generateLink();
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 650);
      })
      .catch((err) => {
        console.log("Unable to copy link", err);
      });
  };

  //when click on 'activate poll' to launch poll, <liveView> will show the selected poll and results
  //when click on share link, user will go to '/events/:eventId/vote'
  //whenever we select a different poll to launch, <Vote> will access that selected poll and render that poll for users to vote
  return (
    // <div className="relative">
    <div
      className=" flex-1 card bg-base-100 shadow-xl custom-max-height-70 custom-min-width"
      // style={{ minWidth: 600 }}
    >
      <div className="card-body ">
        {!selectedPoll && (
          <div className="selected-poll ">
            <div className="content-custom">
              <h3>Launch your poll to gather responses</h3>
              <p>Your event is now active</p>
              <p>
                Once you launch a poll, your participants can now vote with the
                link below
              </p>
              <div className="flex flex-col w-50 mx-auto">
                <Link to={{ pathname: `/events/${eventId}/vote` }}>
                  <div className="flex flex-col items-center justify-center ">
                    <QRCode
                      // value={`/events/${eventId}/vote`}
                      value={generateLink()}
                      className="w-2/3 md:w-2/3"
                    />
                  </div>
                </Link>
                <div>
                  If the QR code doesn't work, you can copy the link here:
                </div>
                <button
                  className="p-2 bg-white border rounded"
                  onClick={() => copyLinkToClipboard(`/events/${eventId}/vote`)}
                >
                  Share link
                </button>
                {showAlert && (
                  <div className="w-50 mx-auto">
                    <div role="alert" className="alert shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-info shrink-0 w-3 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <div>
                        <div className="text-xs">Link copied to clipboard</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedPoll && (
          <div className="selected-poll">
            <DisplayResults />
            <div className="border border-1 border-solid border-navy-blue">
              <div>Participants can vote with the link</div>
              <button
                className="p-2 bg-white border rounded"
                onClick={() => copyLinkToClipboard(`/events/${eventId}/vote`)}
              >
                Share link
              </button>
              {showAlert && (
                <div className="w-50 mx-auto">
                  <div role="alert" className="alert shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-info shrink-0 w-3 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <div>
                      <div className="text-xs">Link copied to clipboard</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
