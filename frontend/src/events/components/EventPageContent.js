import React, { useReducer, useEffect } from "react";
import PollList from "../../polls/components/PollList";
import LiveView from "../../polls/components/LiveView";
import { useCustomContext } from "../../shared/context/CustomContext";

export default function EventPageContent({ eventId }) {
  const { pollState, pollDispatch } = useCustomContext();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch(
          // `http://localhost:7005/api/polls/${eventId}`
          process.env.REACT_APP_BACKEND_URL + `/polls/${eventId}`
        );
        const data = await response.json();
        console.log("fetching polls is ran");
        pollDispatch({ type: "SET_POLLS", payload: data });
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };
    fetchPolls();
  }, [pollDispatch, eventId]);

  let retrievedPolls;
  if (pollState.polls && pollState.polls.events) {
    console.log(pollState.polls.events);
    retrievedPolls = pollState.polls.events;
  }

  return (
    // <CustomContext.Provider value={providerState}>
    <div className="flex flex-wrap justify-between items-end">
      {retrievedPolls && <PollList />}
      <LiveView />
    </div>
    // </CustomContext.Provider>
  );
}
