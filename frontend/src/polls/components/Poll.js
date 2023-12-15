import React, { useState, useEffect, useContext } from "react";
import "./Polls.css";
import { FaWpforms } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import MultipleChoiceForm from "./MultipleChoiceForm";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useCustomContext } from "../../shared/context/CustomContext";
import { FaPencilAlt } from "react-icons/fa";
import FreeTextPoll from "./FreeTextPoll";
import { FaPlayCircle } from "react-icons/fa";
import { GlobalContext } from "../../shared/context/ContextProvider";

const Poll = ({ poll }) => {
  const { pollState, pollDispatch } = useCustomContext();
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewPoll, setShowNewPoll] = useState(false);
  const { sendRequest } = useHttpClient();
  const pollId = poll.id;

  const handleClickOutside = (e) => {
    if (showDropdown && !e.target.closest(".dropdown-icon")) {
      setShowDropdown(false);
    }
  };
  const handleSelectPoll = (selectedPoll) => {
    globalDispatch({
      type: "SET_SELECTED_POLL",
      payload: selectedPoll,
    });
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/polls/${pollId}`,
        "DELETE"
      );
      pollDispatch({ type: "DELETE_POLL", payload: responseData.pollId });
    } catch (e) {
      console.log(e);
    }
    setShowDropdown(false);
  };

  return (
    <React.Fragment>
      {showNewPoll && (
        <div className="overlay">
          <div className="w-full my-3 md:w-2/3 px-3 text-left">
            {poll.type === "Multiple Choice" && (
              <MultipleChoiceForm
                setShowNewPoll={setShowNewPoll}
                editMode={true}
                poll={poll}
              />
            )}
            {poll.type === "Free Text" && (
              <FreeTextPoll setShowNewPoll={setShowNewPoll} poll={poll} />
            )}
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
          {poll.type === "Free Text" && (
            <div>
              <FaPencilAlt />
            </div>
          )}
          <div className="px-2">{poll.type}</div>
          <div className="flex flex-row ml-auto pe-2">
            <div class="launch-poll">
              <button
                className="play-button"
                onClick={() => handleSelectPoll(poll)}
              >
                <FaPlayCircle />
              </button>
              <div className="dropdown-info absolute right-0">
                <p>Activate poll</p>
              </div>
            </div>
            <div>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                class="dropdown-icon icon-edit"
              >
                <BsThreeDotsVertical />
              </button>
            </div>

            {showDropdown && (
              <div className="absolute right-0 px-3 pt-2 bg-white border rounded shadow-md z-10">
                <button
                  className="dropdown-item  button-custom"
                  onClick={() => setShowNewPoll(!showNewPoll)}
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
