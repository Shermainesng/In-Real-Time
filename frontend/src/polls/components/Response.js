import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { MdExpandMore } from "react-icons/md";
import { Button } from "@mui/material";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { Typography } from "@mui/material";

export default function Response({ response }) {
  const [expandReplies, setExpandReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyAdded, setReplyAdded] = useState(false);
  const [replies, setReplies] = useState([]);

  const { sendRequest } = useHttpClient();
  console.log(response.isReply);

  //get all replies - on first load and whenever new replies are added
  useEffect(() => {
    const getAllReplies = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/questions/${response.id}/replies`
        );
        console.log("all replies here", responseData);
        setReplies(responseData.replies);
        setReplyAdded(false);
      } catch (err) {}
    };
    getAllReplies();
  }, [replyAdded]);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL +
          `/questions/${response.id}/replies/new`,
        "POST",
        JSON.stringify({
          replyText,
          replyAuthor,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      setReplyAdded(true);
      setShowReplyForm(false);
      setReplyAuthor("");
      setReplyText("");
    } catch (err) {}
  };

  return (
    <div style={{ width: "90%" }}>
      <Card
        sx={{
          marginTop: 2,
          backgroundColor: response.isReply === true ? "#FBB5ED" : "#A9E1EE",
          // alignSelf: "flex-end",
          display: "flex",
          justifyContent: "space-between",
          // marginLeft: "auto",
        }}
      >
        <div className="flex flex-col items-start p-2">
          <p class="text-lg leading-tight mb-0">{response.responseText}</p>
          <p class="text-sm text-gray-500 mb-0 ">Posted by {response.author}</p>
          {replies && replies.length > 0 && (
            <button
              className="flex items-center cursor-pointer text-navy-blue"
              onClick={() => setExpandReplies(!expandReplies)}
            >
              <MdExpandMore />
              <div variant="subtitle2">{replies.length} replies</div>
            </button>
          )}
        </div>
        {/* only show reply button if it is not a reply */}
        {response.isReply === undefined && (
          <Button onClick={() => setShowReplyForm(!showReplyForm)}>
            <Typography sx={{ margin: 1 }}>Reply</Typography>
          </Button>
        )}
      </Card>

      {showReplyForm && (
        <div>
          <form className="my-2">
            <input
              type="text"
              value={replyText}
              className="bg-gray-200 input input-bordered input-info w-full"
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Add a reply..."
            />
            <input
              type="text"
              value={replyAuthor}
              className="bg-gray-200 input input-bordered input-info w-full mt-1 mb-2"
              onChange={(e) => setReplyAuthor(e.target.value)}
              placeholder="Your name (Optional)"
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={handleSubmitReply}
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
      {expandReplies && (
        <div className="flex flex-col items-end">
          {replies.map((reply, index) => (
            <Response response={reply} key={reply.id} />
          ))}
        </div>
      )}
    </div>
  );
}
