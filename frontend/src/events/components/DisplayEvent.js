import React from "react";
import { Link } from "react-router-dom";

export default function DisplayEvent(props) {
  const { event } = props;
  console.log(event);
  const eventPath = `/events/${event.id}/polls`;
  return (
    <div>
      <Link to={eventPath}>
        <div className="border-4 border-navy-blue bg-light-green p-3 mb-3">
          <div className="text-navy-blue">{event.name}</div>
        </div>
      </Link>
    </div>
  );
}
