import React, { useState } from "react";

import Button from "../../shared/components/FormElements/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function NewEventDate({ setShowNewEventPopup }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = () => {
    setShowNewEventPopup(false);
  };
  return (
    <div className="overlay">
      <div className="card bg-base-100 popup-container bg-white">
        <div className="card-body">
          <h2 className="card-title">When do you want to use this event?</h2>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />

          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
          />
          <div className="card-actions justify-end">
            <Button onClick={handleSubmit} yellow>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
