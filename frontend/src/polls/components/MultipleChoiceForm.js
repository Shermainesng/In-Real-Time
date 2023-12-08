import React, { useState } from "react";
import "./MultipleChoiceForm.css";
import { BsXLg } from "react-icons/bs";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useParams } from "react-router-dom";
import { useCustomContext } from "../../shared/context/CustomContext";

export default function MultipleChoiceForm({ setShowNewPoll, editMode, poll }) {
  const { pollState, pollDispatch } = useCustomContext();
  const [question, setQuestion] = useState(
    editMode && poll ? poll.question : ""
  );
  const [options, setOptions] = useState(editMode && poll ? poll.options : []);
  const [results, setResults] = useState(editMode && poll ? poll.results : []);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const eventId = useParams().eventId;

  console.log("results ", results);

  const handleOptionInput = (index, e) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  const handleRemoveOption = async (index) => {
    //if in edit mode, when removing the option, need check if they have a results array.
    //if have, remove the result in the same index
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    if (editMode) {
      let resultsArr = await getResults();
      resultsArr.splice(index, 1);
      setResults(resultsArr);
    }
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const getResults = async () => {
    let responseData;
    try {
      responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/polls/${poll.id}/results`
      );
    } catch (err) {
      console.log(err);
    }
    return responseData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("results submitted in submit ", results);
    try {
      let responseData;
      if (editMode) {
        responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/polls/${poll.id}`,
          "PATCH",
          JSON.stringify({
            question,
            options,
            results,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        //after updating, need update the pollState
        const updatedPoll = responseData.poll;
        pollDispatch({ type: "UPDATE_POLL", payload: updatedPoll });
      } else {
        responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/polls/${eventId}/new`,
          "POST",
          JSON.stringify({
            question,
            options,
            type: "Multiple Choice",
          }),
          {
            "Content-Type": "application/json",
          }
        );
        const newPoll = responseData.poll;
        pollDispatch({ type: "ADD_POLL", payload: newPoll });
      }
    } catch (err) {
      console.log(err);
    }
    setShowNewPoll(false);
  };

  return (
    <div className="card bg-base-100 popup-container bg-white">
      <div className="card-body text-navy-blue">
        <form onSubmit={handleSubmit}>
          <button type="button" onClick={() => setShowNewPoll(false)}>
            <BsXLg />
          </button>
          <div>
            <label>Question:</label>
            <input
              type="text"
              placeholder="What would you like to ask?"
              value={question}
              className="input bg-white text-navy-blue w-full max-w-xs"
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div>
            <label>Options:</label>
            {options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={option}
                  className="input input-bordered input-info bg-white w-full max-w-xs p-2 my-2"
                  placeholder="add option"
                  onChange={(e) => handleOptionInput(index, e)}
                />
                <button type="button" onClick={() => handleRemoveOption(index)}>
                  <BsXLg />
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddOption}>
              + add another option
            </button>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
