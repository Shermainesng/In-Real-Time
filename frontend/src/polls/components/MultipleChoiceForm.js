import React, { useState } from "react";
import "./MultipleChoiceForm.css";
import { BsXLg } from "react-icons/bs";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useParams } from "react-router-dom";

export default function MultipleChoiceForm({ setShowNewPoll }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const eventId = useParams().eventId;

  const handleOptionInput = (index, e) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        // `http://localhost:7005/api/polls/${eventId}/new`,
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
      console.log(responseData);
    } catch (err) {
      console.log(err);
    }
    setShowNewPoll(false);
  };

  return (
    <div className="overlay">
      <div className="w-2/3 sm:w-1/3 md:w-1/3 px-3 text-left">
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
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                    >
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
      </div>
    </div>
  );
}
