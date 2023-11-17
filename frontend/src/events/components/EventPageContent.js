import React, { useReducer, useEffect } from "react";
import PollList from "../../polls/components/PollList";
import LiveView from "../../polls/components/LiveView";
// import { useStateValue } from "../../shared/context/StateContext";
import CustomContext from "../../shared/context/CustomContext";

function reducer(state, action) {
  switch (action.type) {
    case "SET_POLLS":
      return { ...state, polls: action.payload };
    case "SELECT_POLL":
      return {
        ...state,
        selectedPoll: action.payload,
      };
    default:
      return state;
  }
}

export default function EventPageContent({ eventId }) {
  const [pollState, pollDispatch] = useReducer(reducer, {
    polls: [],
    selectedPoll: null,
  });

  const providerState = {
    pollState,
    pollDispatch,
  };

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch(
          `http://localhost:7005/api/polls/${eventId}`
        );
        const data = await response.json();
        pollDispatch({ type: "SET_POLLS", payload: data });
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };
    fetchPolls();
  }, [pollDispatch]);

  let retrievedPolls;
  if (pollState.polls && pollState.polls.events) {
    retrievedPolls = pollState.polls.events;
  }

  return (
    <CustomContext.Provider value={providerState}>
      <div className="flex flex-wrap justify-between items-end">
        {retrievedPolls && <PollList />}
        <LiveView />
      </div>
    </CustomContext.Provider>
  );
}
