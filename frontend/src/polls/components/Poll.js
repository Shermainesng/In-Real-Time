import React, { useState } from "react";
import { FaWpforms } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import MultipleChoiceForm from "./MultipleChoiceForm";

const Poll = ({ poll }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const toggleDropdown = () => {
    console.log(showDropdown);
    setShowDropdown(!showDropdown);
  };
  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleDelete = () => {};
  return (
    <React.Fragment>
      {editMode && (
        <div>
          <MultipleChoiceForm />
        </div>
      )}
      <div className="poll-card py-2">
        <div className="flex items-center">
          {poll.type === "Multiple Choice" && (
            <div>
              <FaWpforms />
            </div>
          )}
          <div className="px-2">{poll.type}</div>
          <div className="ml-auto pe-2">
            <button onClick={toggleDropdown} class="icon-edit">
              <BsThreeDotsVertical />
            </button>

            {showDropdown && (
              <div className="absolute right-0 px-3 pt-2 bg-white border rounded shadow-md">
                <button
                  className="dropdown-item  button-custom"
                  onClick={handleEdit}
                >
                  <p>Edit</p>
                </button>
                <button
                  className="dropdown-item button-custom"
                  onClick={handleDelete}
                >
                  <p>Delete</p>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="text-left text-navy-blue">{poll.question}</div>
      </div>
    </React.Fragment>
  );
};

export default Poll;
