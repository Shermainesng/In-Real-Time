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
    setLocalPolls(pollState.polls || []);
  }, [pollState]);

  return (
    <div className="z-0 relative card flex-1 card bg-base-100 shadow-xl custom-max-height-70 overflow-y-auto">
      <div className="card-body">
        {localPolls.length > 0 &&
          localPolls.map((poll) => (
            <div key={poll.id}>
              <Poll poll={poll} />
            </div>
          ))}
      </div>
    </div>
  );
}
