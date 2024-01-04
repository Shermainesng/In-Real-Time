import React, { useEffect, useState, useContext } from "react";
import Poll from "./Poll";
import "./Polls.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useCustomContext } from "../../shared/context/CustomContext";
import LiveView from "./LiveView";
import { GlobalContext } from "../../shared/context/ContextProvider";

export default function PollList(props) {
  const { pollState, pollDispatch } = useCustomContext();
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const [localPolls, setLocalPolls] = useState([]);

  useEffect(() => {
    // setLocalPolls(pollState.polls || []);
    setLocalPolls((prevLocalPolls) => pollState.polls || prevLocalPolls);
  }, [pollState]);

  console.log(localPolls);

  return (
    <div className="z-0 relative flex-1 card bg-base-100 shadow-xl custom-max-height-70">
      <div className="card-body">
        <div className="text-sm">
          Click on the play button to make your poll visible for your guests.
          Click on the pause button to deactivate your poll.
        </div>
        {localPolls.length > 0 &&
          localPolls.map((poll) => (
            <div key={poll._id}>
              <Poll poll={poll} />
            </div>
          ))}
        {localPolls.length === 0 && (
          <div>You have no polls yet. Start adding some!</div>
        )}
      </div>
    </div>
  );
}
