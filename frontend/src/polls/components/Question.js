import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Button, TablePagination, Typography } from "@mui/material";
import { MdExpandMore } from "react-icons/md";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Response from "./Response";

function Question({ question }) {
  const currentTime = new Date();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [responseAuthor, setResponseAuthor] = useState("");
  const [responses, setResponses] = useState([]);
  const [expandResponses, setExpandResponses] = useState(false);
  const [newResponseAdded, setNewResponseAdded] = useState(false);
  const [timeText, setTimeText] = useState("");
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    if (question.createdAt !== null) {
      var postedTime = new Date(question.createdAt);
      const timeDifference = currentTime - postedTime;
      const millisecondsInADay = 1000 * 60 * 60 * 24;
      var daysDifference = Math.floor(timeDifference / millisecondsInADay);

      if (daysDifference === 0) {
        //same day, print time
        const formattedTime = postedTime.toLocaleTimeString();
        setTimeText(`at ${formattedTime}`);
      } else {
        setTimeText(`${daysDifference} days ago`);
      }
    }
  }, []);

  //get responses on first load + everytime new response is added
  useEffect(() => {
    const getAllResponses = async () => {
      console.log("get all questions");
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/questions/${question.id}/responses`
        );
        console.log("responsedata here", responseData);
        setNewResponseAdded(false);
        setResponses(responseData.responses);
      } catch (err) {
        console.log(err);
      }
    };
    getAllResponses();
  }, [newResponseAdded]);

  //create new response
  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    console.log("author of reply", responseAuthor);
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL +
          `/questions/${question.id}/responses/new`,
        "POST",
        JSON.stringify({
          responseText,
          responseAuthor,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      console.log(responseData);
      setShowReplyForm(false);
      setNewResponseAdded(true);
      setResponseText("");
      setResponseAuthor("");
    } catch (err) {}
  };
  return (
    <div>
      <Card sx={{ marginTop: 2 }}>
        <div className="flex justify-between items-end">
          {/* <div> */}
          <div class="flex flex-col items-start border-b border-gray-200 py-2 px-2">
            {/* <div class="flex-grow text-left"> */}
            <p class="text-lg leading-tight mb-0">{question.questionText}</p>
            {/* </div> */}
            {/* <div class="flex flex-col text-right"> */}
            <p class="text-sm text-gray-500 mb-0 ">By {question.author}</p>
            <p class="text-xs text-gray-500 mb-0">Posted {timeText}</p>
            {/* </div> */}
            {responses.length > 0 && (
              <button
                className="flex items-center cursor-pointer text-navy-blue"
                onClick={() => setExpandResponses(!expandResponses)}
              >
                <MdExpandMore />
                <Typography variant="subtitle2">
                  {responses.length} replies
                </Typography>
              </button>
            )}
          </div>
          {/* </div> */}
          <Button onClick={() => setShowReplyForm(true)}>
            <Typography sx={{ margin: 1 }}>Reply</Typography>
          </Button>
        </div>
      </Card>
      {showReplyForm && (
        <div>
          <form className="my-2">
            <input
              type="text"
              value={responseText}
              className="bg-gray-200 input input-bordered input-info w-full"
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Add a reply..."
            />
            <input
              type="text"
              value={responseAuthor}
              className="bg-gray-200 input input-bordered input-info w-full mt-1 mb-2"
              onChange={(e) => setResponseAuthor(e.target.value)}
              placeholder="Your name (Optional)"
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={handleSubmitResponse}
                variant="outlined"
                size="small"
              >
                Send reply
              </Button>
              <Button
                onClick={() => setShowReplyForm(false)}
                variant="outlined"
                size="small"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
      {expandResponses && (
        <div className="flex flex-col items-end">
          {responses.map((response, index) => (
            <Response response={response} key={response.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Question;
