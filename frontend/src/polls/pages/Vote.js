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
  let socket;
  if (process.env.NODE_ENV === "production") {
    console.log("hit correct condition");
    socket = io.connect("https://in-real-time-api.onrender.com");
  } else {
    socket = io.connect("http://localhost:7005");
  }

  // console.log("selected poll in Vote.js", globalState);
  //store state in localStorage whenever it changes
  // useEffect(() => {
  //   localStorage.setItem("selectedPoll", JSON.stringify(globalState));
  // }, [globalState]);

  useEffect(() => {
    if (!globalState.selectedPoll) {
      const storedState = localStorage.getItem("selectedPoll");
      if (storedState) {
        console.log("from local storage", JSON.parse(storedState));
        const selected = JSON.parse(storedState);
        setSelectedPoll(selected.selectedPoll);
      }
    } else {
      setSelectedPoll(globalState.selectedPoll);
      console.log("saving in local storage", globalState);
      localStorage.setItem("selectedPoll", JSON.stringify(globalState));
    }
  }, [globalState]);

  useEffect(() => {
    socket.emit("result_updated", { resultState });
  }, [resultState, resultDispatch]);

  //listen to events and get updated results whenever results are updated
  useEffect(() => {
    socket.on("message_received", (data) => {
      console.log("received from backend", data);
      setUpdatedResults(data.resultState.results);
      setUpdatedResponses(data.resultState.responses);
      setTotalVote(getTotalVoteCount(data.resultState.results));
    });
  }, [socket]);

  //get results/responses when component first mounts
  useEffect(() => {
    if (selectedPoll) {
      const getResults = async () => {
        let responseData;
        try {
          responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + `/polls/${selectedPoll.id}`
          );
          console.log("getting results from backend", responseData);
          resultDispatch({
            type: "SET_RESULTS",
            payload: responseData.pollResults,
          });
          resultDispatch({
            type: "SET_RESPONSES",
            payload: responseData.poll.responses,
          });
          // setTotalVote(getTotalVoteCount(responseData.pollResults));
        } catch (err) {}
      };
      getResults();
    }
  }, [selectedPoll]);

  //get the counts for that index, and update it (+1 to selected option)
  //   /:pollId/results
  const handleSubmit = async (e) => {
    e.preventDefault();
    let resultsData;
    if (!showResults) {
      if (selectedPoll && selectedPoll.type === "Multiple Choice") {
        resultsData = resultState.results;
        resultsData[selectedOptionIdx]++;
        console.log(resultsData);
      }
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/polls/${selectedPoll.id}`,
          "PATCH",
          JSON.stringify({
            response,
            resultsData,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        console.log("results from update poll", responseData);
        resultDispatch({
          type: "SET_RESPONSES",
          payload: responseData.poll.responses,
        });
        resultDispatch({
          type: "SET_RESULTS",
          payload: responseData.poll.results,
        });
      } catch (err) {
        console.log(err);
      }
      setShowResults(true);
    }
  };

  const getTotalVoteCount = (resultsArr) => {
    let sum = 0;
    if (resultsArr) {
      for (let i = 0; i < resultsArr.length; i++) {
        sum += parseInt(resultsArr[i]);
      }
    }
    return sum;
  };

  return (
    <CustomContext.Provider value={providerState}>
      <div className="h-screen flex items-center justify-center bg-purple">
        <div className="h-50 w-full sm:w-3/3 md:w-2/3 border-2 border-navy-blue">
          {!selectedPoll && (
            <div>There are no active polls at the moment. </div>
          )}
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
                      <div>
                        <progress
                          className="progress w-56"
                          value={updatedResults[index]}
                          max={totalVote}
                        ></progress>
                        <span>{updatedResults[index]}</span>
                      </div>
                    )}
                  </label>
                </div>
              ))}
            {/* <span>{totalVote}</span> */}
            {selectedPoll && selectedPoll.type === "Free Text" && (
              <div>
                {!showResults && (
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
                )}
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
