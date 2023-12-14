import React, { useReducer, useEffect } from "react";
import PollList from "../../polls/components/PollList";
import LiveView from "../../polls/components/LiveView";
import { useCustomContext } from "../../shared/context/CustomContext";

export default function EventPageContent({ eventId }) {
  return (
    // <CustomContext.Provider value={providerState}>
    <div className="flex flex-wrap justify-between items-end mb-3">
      {<PollList />}
      <LiveView eventId={eventId} />
    </div>
    // </CustomContext.Provider>
  );
}
