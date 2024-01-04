import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../shared/context/ContextProvider";
import { useSocketEvent } from "../../shared/hooks/useSocketEvent";
import io from "socket.io-client";
import { TbSumOff } from "react-icons/tb";

let socket;
if (process.env.NODE_ENV === "production") {
  socket = io.connect("https://in-real-time-api.onrender.com");
} else {
  socket = io.connect("http://localhost:7005");
}
//when global state poll is selected, display updated options & results
//when votes are being updated in Vote.js, emit a message to update the updated poll's options & results

function DisplayResults() {
  const { globalState } = useContext(GlobalContext);
  const [results, setResults] = useState([]);
  const [responses, setResponses] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);

  useEffect(() => {
    if (globalState.selectedPoll !== null) {
      setSelectedPoll(globalState.selectedPoll);
    }
  }, [globalState.selectedPoll]);

  useEffect(() => {
    if (selectedPoll) {
      if (selectedPoll.type === "Multiple Choice") {
        setResults(selectedPoll.results);
      } else {
        setResponses(selectedPoll.responses);
      }
    }
  }, [selectedPoll]);

  const handleMessageReceived = (data) => {
    setResults(data.resultState.results);
    setResponses(data.resultState.responses);
  };

  //   //when result state changed (a vote is made or new responses)
  useSocketEvent(socket, "message_received", handleMessageReceived);

  const getTotalVotes = () => {
    let sum = 0;
    console.log(results);
    for (let i = 0; i < results.length; i++) {
      sum += parseInt(results[i], 10);
    }
    console.log(sum);
    return sum;
  };

  return (
    <div>
      {selectedPoll && selectedPoll.type === "Multiple Choice" && (
        <div>
          <h3>{selectedPoll.question}</h3>
          <br />
          {getTotalVotes()} votes received
          <div>
            Options:
            {selectedPoll.options &&
              selectedPoll.options.map((option, index) => (
                <div key={index}>
                  <ul className="ps-0">
                    <li>{option}</li>
                    {results && results.length > 0 && (
                      <progress
                        className="progress w-full"
                        value={results[index]}
                        max={getTotalVotes()}
                      ></progress>
                    )}
                    {results.length === 0 && (
                      <progress
                        className="progress w-full"
                        value={0}
                        max={0}
                      ></progress>
                    )}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      )}

      {selectedPoll && selectedPoll.type === "Free Text" && (
        <div>
          <h3>{selectedPoll.question}</h3>
          <br />
          Responses:
          {responses &&
            responses.length > 0 &&
            responses.map((response, index) => (
              <div key={index}>{response}</div>
            ))}
        </div>
      )}
    </div>
  );
}

export default DisplayResults;
