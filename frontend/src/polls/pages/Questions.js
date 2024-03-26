import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Question from "../components/Question";

export default function Questions() {
  const [questionText, setQuestionText] = useState("");
  const [author, setAuthor] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestionCreated, setNewQuestionCreated] = useState(false);
  const eventId = useParams().eventId.toString();
  const { sendRequest } = useHttpClient();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(questionText);
    console.log(author);
    createNewQuestion();
    setQuestionText("");
    setAuthor("");
  };

  //method to create new question
  const createNewQuestion = async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/questions/${eventId}/new`,
        "POST",
        JSON.stringify({
          questionText,
          author,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      setNewQuestionCreated(true);
    } catch (err) {
      console.log(err);
    }
  };

  //always fetching questions to display on screen
  useEffect(() => {
    const getAllQuestions = async () => {
      console.log("get all questions");
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/questions/${eventId}/questions`
        );
        setQuestions(responseData.questions);
        setNewQuestionCreated(false);
      } catch (err) {
        console.log(err);
      }
    };
    getAllQuestions();
  }, [newQuestionCreated]);

  return (
    <div className="min-h-screen flex flex-col items-center  bg-purple text-navy-blue pb-5">
      <form className="pt-5 w-3/4 md:w-1/2" onSubmit={handleSubmit}>
        <input
          type="text"
          value={questionText}
          className="bg-white input input-bordered input-info w-full "
          style={{ minHeight: "40px", height: "10vh" }}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Type your question"
        />
        <input
          type="text"
          value={author}
          className="bg-white input input-bordered input-info w-full p-2 my-2"
          onChange={(e) => {
            setAuthor(e.target.value);
          }}
          // onBlur={handleBlur}
          placeholder="Your name (optional)"
        />
        <Button type="submit">Send</Button>
      </form>
      <div className=" pt-3 flex flex-col items-center w-full md:w-3/4">
        <h2>Questions from the audience:</h2>
        <div className="flex-col w-full px-3">
          {questions &&
            questions.length > 0 &&
            questions.map((qns) => (
              <div>
                <Question question={qns} key={qns.id} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
