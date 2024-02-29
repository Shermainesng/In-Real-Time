import React, { useState } from "react";
import { BsXLg } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useCustomContext } from "../../shared/context/CustomContext";

function FreeTextPoll(props) {
  const { setShowNewPoll, poll } = props;
  const { sendRequest } = useHttpClient();
  const [question, setQuestion] = useState(poll ? poll.question : "");
  const { pollState, pollDispatch } = useCustomContext();
  const eventId = useParams().eventId;

  console.log("reached FreeTextPoll.js", poll);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let responseData;
    try {
      if (poll) {
        responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/polls/${poll.id}`,
          "PATCH",
          JSON.stringify({
            question,
            options: null,
            type: "Free Text",
          }),
          {
            "Content-Type": "application/json",
          }
        );
        const updatedPoll = responseData.poll;
        pollDispatch({ type: "UPDATE_POLL", payload: updatedPoll });
        // pollDispatch({ type: "SELECT_POLL", payload: updatedPoll });
      } else {
        responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/polls/${eventId}/new`,
          "POST",
          JSON.stringify({
            question,
            options: null,
            type: "Free Text",
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
              id="question"
              name="question"
              value={question}
              placeholder="type a question for your audience"
              className="bg-white input input-bordered input-info w-full p-2 my-2"
              onChange={(e) => setQuestion(e.target.value)}
            ></input>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default FreeTextPoll;
