import React, { useState } from "react";
import "./MultipleChoiceForm.css";
import { BsXLg } from "react-icons/bs";

export default function MultipleChoiceForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    //save the poll to the db - send eventId, question and options array to db
    //in that api, we save the poll to that event, and save the options to the poll
  };
  return (
    <div className="overlay">
      <div className="w-2/3 sm:w-1/3 md:w-1/3 px-3 text-left">
        <div className="card bg-base-100 popup-container bg-white">
          <div className="card-body text-navy-blue">
            <form onSubmit={handleSubmit}>
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
