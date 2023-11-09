import React, { useState } from "react";
import { FaWpforms } from "react-icons/fa";

const Poll = ({ poll }) => {
  console.log(poll);
  return (
    <React.Fragment>
      <div className="poll-card py-2">
        <div className="flex items-center">
          {poll.type === "Multiple Choice" && (
            <div>
              <FaWpforms />
            </div>
          )}
          <div className="px-2">{poll.type}</div>
        </div>
        <div className="text-left text-navy-blue">{poll.question}</div>
      </div>
    </React.Fragment>
  );
};

export default Poll;
