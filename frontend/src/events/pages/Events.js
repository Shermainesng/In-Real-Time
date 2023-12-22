import React, { useState, useEffect } from "react";
import { useContext } from "react";
import DisplayEvent from "../components/DisplayEvent";
import { AiOutlinePlus } from "react-icons/ai";
import NewEventDate from "../components/NewEventDate";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

export default function Events() {
  const [showNewEventPopup, setShowNewEventPopup] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [activeEvents, setActiveEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  //get request for all Events
  useEffect(() => {
    const getAllEvents = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/events/${userId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(responseData);
        separateEventsByDate(responseData.events);
      } catch (err) {}
    };
    getAllEvents();
  }, [sendRequest, userId]);

  const separateEventsByDate = (events) => {
    const currentDate = new Date().toISOString().split("T")[0];
    for (let event of events) {
      if (event.endDate >= currentDate) {
        setActiveEvents((activeEvents) => [...activeEvents, event]);
      } else {
        setPastEvents((pastEvents) => [...pastEvents, event]);
      }
    }
  };

  const updateEventsAfterDelete = (deletedEventId, isActive) => {
    if (isActive) {
      setActiveEvents((activeEvents) =>
        activeEvents.filter((event) => event.id !== deletedEventId)
      );
    } else {
      setPastEvents((pastEvents) =>
        pastEvents.filter((event) => event.id !== deletedEventId)
      );
    }
  };

  return (
    <div className="h-screen bg-purple  relative">
      <div className="p-3 inset-0 items-center">
        {showNewEventPopup && (
          <div className="overlay">
            <NewEventDate setShowNewEventPopup={setShowNewEventPopup} />
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-center p-2">
          <div className="text-navy-blue text-3xl">active</div>
          <div className="">
            <div
              onClick={() => {
                setShowNewEventPopup(true);
              }}
              className="border border-2 border-bright-yellow text-white rounded bg-navy-blue p-1 text-sm flex flex-row items-center"
            >
              <AiOutlinePlus />
              create new event
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          {activeEvents.length > 0 &&
            activeEvents.map((event) => (
              <div className="flex flex-col w-full md:w-2/3 px-3">
                <DisplayEvent
                  event={event}
                  onDelete={updateEventsAfterDelete}
                  isActive={true}
                />
              </div>
            ))}
          <div className="text-navy-blue text-3xl text-left">past</div>
          {pastEvents.length > 0 &&
            pastEvents.map((event) => (
              <div className="flex flex-col w-full md:w-2/3 px-3">
                <DisplayEvent
                  event={event}
                  onDelete={updateEventsAfterDelete}
                  isActive={false}
                />
              </div>
            ))}
          {pastEvents.length === 0 && activeEvents.length === 0 && (
            <p>
              You have no events yet. Create a new event and start interacting
              with your audience!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
