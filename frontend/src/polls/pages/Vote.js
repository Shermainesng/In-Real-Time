import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";

export default function Vote() {
  const location = useLocation();
  const { question, options } = location.state;
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [totalVote, setTotalVote] = useState(0);
  const pollId = useParams().pollId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const optionResultsRef = useRef(null);

  const handleChange = (e) => {
    setSelectedOptionIdx(e.target.value);
  };

  useEffect(() => {
    const getResults = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:7005/api/polls/${pollId}/results`
        );
        console.log(responseData);
        optionResultsRef.current = responseData;
        // console.log("getting results: ");
        setResults(optionResultsRef.current);
        // console.log(results);
        setTotalVote(getTotalVoteCount(optionResultsRef.current));
      } catch (err) {}
    };
    getResults();
  }, [sendRequest, selectedOptionIdx, pollId]);

  //get the counts for that index, and update it (+1 to selected option)
  //   /:pollId/results
  let resultsData;
  const handleSubmit = (e) => {
    e.preventDefault();
    resultsData = optionResultsRef.current;
    resultsData[selectedOptionIdx]++;
    console.log(resultsData);
    //post request to update scores
    updateResults(resultsData);
  };

  const updateResults = async (resultsData) => {
    try {
      const responseData = await sendRequest(
        `http://localhost:7005/api/polls/${pollId}/results`,
        "POST",
        JSON.stringify({
          resultsData,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      console.log("updated result from DB");
      setResults(responseData.results);
      //   console.log(results);
      setTotalVote(getTotalVoteCount(results));
      //   console.log(totalVote);
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalVoteCount = (resultsArray) => {
    console.log("inGetTotalVotes");
    console.log(resultsArray);
    let sum = 0;
    for (let i = 0; i < resultsArray.length; i++) {
      sum += parseInt(resultsArray[i]);
    }
    return sum;
  };

  return (
    <div className="h-screen flex items-center justify-center bg-purple">
      <div className="h-50 w-full sm:w-3/3 md:w-2/3 border-2 border-navy-blue">
        <form onSubmit={handleSubmit}>
          <div>{question}</div>
          {options &&
            options.map((option, index) => (
              <div>
                <label>
                  <input
                    type="radio"
                    name="option"
                    value={index}
                    onChange={handleChange}
                  />
                  {option}
                  {results && results[index]}
                  <progress
                    className="progress w-56"
                    value={results[index]}
                    max={totalVote}
                  ></progress>
                </label>
              </div>
            ))}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
