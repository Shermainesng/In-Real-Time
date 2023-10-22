import React, { useState } from "react";

import Event from "../components/Event";
import Button from "../../shared/components/FormElements/Button";
import NewEventDate from "../components/NewEventDate";

export default function Events() {
  const [showNewEventPopup, setShowNewEventPopup] = useState(false);

  return (
    <div className="h-screen relative">
      <div className="bg-purple absolute inset-0 items-center">
        {showNewEventPopup && (
          <NewEventDate setShowNewEventPopup={setShowNewEventPopup} />
        )}
        <div className="flex justify-between items-center justify-center">
          <div className="text-navy-blue text-3xl">active</div>
          <Button
            onClick={() => {
              setShowNewEventPopup(true);
            }}
            className="px-4"
            yellow
          >
            Create New Event
          </Button>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col w-full sm:w-3/3 md:w-3/3 px-3">
            <Event />
          </div>
          <div className="flex flex-col w-full sm:w-2/3 md:w-1/3">
            <div className="text-navy-blue text-3xl">past</div>
            <Event />
          </div>
          <p>
            You have no events yet. Create a new event and start interacting
            with your audience!
          </p>
        </div>
      </div>
    </div>
  );
}
