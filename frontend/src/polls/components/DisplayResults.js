import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../shared/context/ContextProvider";
import { useSocketEvent } from "../../shared/hooks/useSocketEvent";
import io from "socket.io-client";

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
  const [selectedPoll, setSelectedPoll] = useState(null);

  useEffect(() => {
    if (globalState.selectedPoll !== null) {
      setSelectedPoll(globalState.selectedPoll);
    }
  }, [globalState.selectedPoll]);

  useEffect(() => {
    if (selectedPoll) {
      console.log("selected poll in LiveView", selectedPoll);
      setResults(selectedPoll.results);
    }
  }, [selectedPoll]);

  const handleMessageReceived = (data) => {
    setResults(data.resultState.results);
  };

  //   //when result state changed (a vote is made)
  useSocketEvent(socket, "message_received", handleMessageReceived);

  return (
    <div>
      <div>{selectedPoll && selectedPoll.question}</div>
      {selectedPoll &&
        selectedPoll.options &&
        selectedPoll.options.map((option, index) => (
          <div>
            <ul>
              <li>{option}</li>
              {results && results[index]}
            </ul>
          </div>
        ))}
    </div>
  );
}

export default DisplayResults;
