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
import { FaCirclePause } from "react-icons/fa6";

import io from "socket.io-client";
let socket;
if (process.env.NODE_ENV === "production") {
  console.log("hit correct condition");
  socket = io.connect("https://in-real-time-api.onrender.com");
} else {
  socket = io.connect("http://localhost:7005");
}

const Poll = ({ poll }) => {
  const { pollState, pollDispatch } = useCustomContext();
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewPoll, setShowNewPoll] = useState(false);
  const [selectedOne, setSelectedOne] = useState("");
  const { sendRequest } = useHttpClient();
  const pollId = poll.id;

  const handleClickOutside = (e) => {
    if (showDropdown && !e.target.closest(".dropdown-icon")) {
      setShowDropdown(false);
    }
  };
  //when poll is launched
  const handleSelectPoll = (selectedPoll) => {
    //if same poll selected again, pause it
    if (selectedPoll.id === selectedOne) {
      localStorage.removeItem("selectedPoll");
      setSelectedOne("");
      globalDispatch({
        type: "SET_SELECTED_POLL",
        payload: null,
      });
    } else {
      globalDispatch({
        type: "SET_SELECTED_POLL",
        payload: selectedPoll,
      });
    }
  };

  //to handle when host launches a poll
  useEffect(() => {
    socket.emit("poll_selected", { globalState });

    if (globalState.selectedPoll) {
      setSelectedOne(globalState.selectedPoll.id);
    }
    console.log("global state in poll.js", globalState);
    localStorage.setItem("selectedPoll", JSON.stringify(globalState)); //store in local state so new tabs can access
  }, [globalState, globalDispatch]);

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

  console.log("selectedOne", selectedOne);
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
      {poll && (
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
            <div className="flex flex-row items-center ml-auto pe-2">
              <div class="launch-poll">
                <button onClick={() => handleSelectPoll(poll)}>
                  <div
                    className={
                      selectedOne === poll.id
                        ? "icon-pause text-red-500 text-2xl"
                        : "icon-play text-navy-blue text-2xl"
                    }
                  >
                    {selectedOne === poll.id ? (
                      <FaCirclePause />
                    ) : (
                      <FaPlayCircle />
                    )}
                  </div>
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
      )}
    </React.Fragment>
  );
};

export default Poll;
