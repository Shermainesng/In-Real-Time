import React, { useState, useEffect, useContext, useReducer } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import CustomContext from "../../shared/context/CustomContext";
import { useCustomContext } from "../../shared/context/CustomContext";
import { GlobalContext } from "../../shared/context/ContextProvider";

import io from "socket.io-client";

function reducer(state, action) {
  switch (action.type) {
    case "SET_RESULTS":
      return {
        ...state,
        results: action.payload,
      };
    case "SET_RESPONSES":
      return {
        ...state,
        responses: action.payload,
      };
    default:
      return state;
  }
}

export default function Vote() {
  const [resultState, resultDispatch] = useReducer(reducer, {
    results: [],
    responses: [],
  });

  const providerState = {
    resultState,
    resultDispatch,
  };

  const { globalState, globalDispatch } = useContext(GlobalContext);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [updatedResults, setUpdatedResults] = useState([]);
  const [response, setResponse] = useState("");
  const [updatedResponses, setUpdatedResponses] = useState([]);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);
  const [totalVote, setTotalVote] = useState(0);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const socket = io.connect("http://localhost:3002");

  console.log("selected poll in Vote.js", globalState);
  useEffect(() => {
    setSelectedPoll(globalState.selectedPoll);
  }, [globalState]);

  let pollId;
  if (selectedPoll) {
    pollId = selectedPoll.id;
  }

  useEffect(() => {
    socket.emit("result_updated", { resultState });
  }, [resultState]);

  //listen to events and get updated results
  useEffect(() => {
    socket.on("message_received", (data) => {
      console.log("results are updated", data);
      setUpdatedResults(data.resultState.results);
      setUpdatedResponses(data.resultState.responses);
    });
  }, [socket]);

  //get results/responses when component first mounts
  useEffect(() => {
    const getResults = async () => {
      let responseData;
      try {
        responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/polls/${pollId}`
        );
        console.log("got from backend", responseData);
        resultDispatch({
          type: "SET_RESULTS",
          payload: responseData.poll.results,
        });
        resultDispatch({
          type: "SET_RESPONSES",
          payload: responseData.poll.responses,
        });
        setTotalVote(getTotalVoteCount());
      } catch (err) {}
    };
    getResults();
  }, []);

  //get the counts for that index, and update it (+1 to selected option)
  //   /:pollId/results
  let resultsData;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!showResults) {
      if (selectedPoll && selectedPoll.type !== "Free Text") {
        resultsData = resultState.results;
        resultsData[selectedOptionIdx]++;
        updateResults(resultsData);
      } else {
        try {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + `/polls/${pollId}`,
            "PATCH",
            JSON.stringify({
              response,
            }),
            {
              "Content-Type": "application/json",
            }
          );
          resultDispatch({
            type: "SET_RESPONSES",
            payload: responseData.poll.responses,
          });
        } catch (err) {
          console.log(err);
        }
      }
      setShowResults(true);
    }
  };

  const updateResults = async (resultsData) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/polls/${pollId}/results`,
        "POST",
        JSON.stringify({
          resultsData,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      resultDispatch({ type: "SET_RESULTS", payload: responseData.results });
      setTotalVote(getTotalVoteCount());
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalVoteCount = () => {
    let resultsArray = resultState.results;
    let sum = 0;
    for (let i = 0; i < resultsArray.length; i++) {
      sum += parseInt(resultsArray[i]);
    }
    return sum;
  };

  return (
    <CustomContext.Provider value={providerState}>
      <div className="h-screen flex items-center justify-center bg-purple">
        <div className="h-50 w-full sm:w-3/3 md:w-2/3 border-2 border-navy-blue">
          <form onSubmit={handleSubmit}>
            <div>{selectedPoll && selectedPoll.question}</div>
            {selectedPoll &&
              selectedPoll.options &&
              selectedPoll.options.map((option, index) => (
                <div>
                  <label>
                    <input
                      type="radio"
                      name="option"
                      value={index}
                      onChange={(e) => setSelectedOptionIdx(e.target.value)}
                      disabled={showResults}
                    />
                    {option}
                    {showResults && updatedResults.length > 0 && (
                      <progress
                        className="progress w-56"
                        value={updatedResults[index]}
                        max={totalVote}
                      ></progress>
                    )}
                  </label>
                </div>
              ))}
            {selectedPoll && selectedPoll.type === "Free Text" && (
              <div>
                <textarea
                  className="bg-white input input-bordered input-info w-2/3"
                  id="response"
                  name="response"
                  value={response}
                  rows="10"
                  cols="20"
                  placeholder="Type your answer..."
                  onChange={(e) => setResponse(e.target.value)}
                ></textarea>
                {showResults &&
                  updatedResponses &&
                  updatedResponses.length > 0 &&
                  updatedResponses.map((userResponse) => (
                    <div>{userResponse}</div>
                  ))}
              </div>
            )}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </CustomContext.Provider>
  );
}
