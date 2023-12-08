import React, { useState } from "react";
import { FaWpforms } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import MultipleChoiceForm from "./MultipleChoiceForm";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useCustomContext } from "../../shared/context/CustomContext";

const Poll = ({ poll }) => {
  const { pollState, pollDispatch } = useCustomContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewPoll, setShowNewPoll] = useState(false);
  const { sendRequest } = useHttpClient();
  const pollId = poll.id;

  const toggleDropdown = () => {
    console.log(showDropdown);
    setShowDropdown(!showDropdown);
  };
  const handleEdit = () => {
    setShowNewPoll(!showNewPoll);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/polls/${pollId}`,
        "DELETE"
      );
      console.log(responseData.pollId);
      pollDispatch({ type: "DELETE_POLL", payload: responseData.pollId });
    } catch (e) {
      console.log(e);
    }
    toggleDropdown();
  };

  return (
    <React.Fragment>
      {showNewPoll && (
        <div className="overlay">
          <div className="w-full md:w-2/3 px-3 text-left">
            <MultipleChoiceForm
              setShowNewPoll={setShowNewPoll}
              editMode={true}
              poll={poll}
            />
          </div>
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
