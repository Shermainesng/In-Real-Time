import React, { useReducer, useEffect } from "react";
import PollList from "../../polls/components/PollList";
import LiveView from "../../polls/components/LiveView";
import { useCustomContext } from "../../shared/context/CustomContext";

export default function EventPageContent({ eventId }) {
  const { pollState, pollDispatch } = useCustomContext();

  // console.log("eventpagecontent", pollState);

  // useEffect(() => {
  //   const fetchPolls = async () => {
  //     try {
  //       const response = await fetch(
  //         process.env.REACT_APP_BACKEND_URL + `/polls/${eventId}`
  //       );
  //       const data = await response.json();
  //       console.log("fetching polls is ran in EventpageContent.js");
  //       pollDispatch({ type: "SET_POLLS", payload: data });
  //     } catch (error) {
  //       console.error("Error fetching polls:", error);
  //     }
  //   };
  //   if (pollState) {
  //     fetchPolls();
  //   }
  // }, [eventId, pollDispatch]);

  // let retrievedPolls;
  // if (pollState && pollState.polls && pollState.polls.events) {
  //   console.log(pollState.polls.events);
  //   retrievedPolls = pollState.polls.events;
  // }

  return (
    // <CustomContext.Provider value={providerState}>
    <div className="flex flex-wrap justify-between items-end mb-3">
      {<PollList />}
      <LiveView />
    </div>
    // </CustomContext.Provider>
  );
}
