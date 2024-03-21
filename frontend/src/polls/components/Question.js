import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Button, TablePagination, Typography } from "@mui/material";
import { MdExpandMore } from "react-icons/md";

function Question({ question }) {
  const currentTime = new Date();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplayText] = useState("");
  if (question.createdAt !== null) {
    var postedTime = new Date(question.createdAt);
    console.log(postedTime);
    const timeDifference = currentTime - postedTime;
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    var daysAgo = Math.floor(timeDifference / millisecondsInADay);
  }

  const timeText =
    daysAgo && daysAgo > 1
      ? `${daysAgo} days ago`
      : `Posted at ${postedTime.getHours()}:${postedTime.getMinutes()}:${postedTime.getSeconds()}`;

  return (
    <div>
      <Card sx={{ marginTop: 3 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <div>
            <CardHeader
              sx={{ textAlign: "left", padding: 1, flex: "1" }}
              title={
                <Typography variant="subtitle1">
                  {question.questionText}
                </Typography>
              }
              subheader={
                <div>
                  <Typography variant="caption" sx={{ paddingBottom: 0 }}>
                    Posted by {question.author}
                  </Typography>
                  <br />
                  <Typography variant="caption">{timeText}</Typography>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <MdExpandMore />
                    <Typography variant="subtitle2">replies</Typography>
                  </div>
                </div>
              }
            />
          </div>
          <Button onClick={() => setShowReplyForm(true)}>
            <Typography sx={{ margin: 1 }}>Reply</Typography>
          </Button>
        </div>
      </Card>
      {showReplyForm && (
        <div>
          <form>
            <input
              type="text"
              value={replyText}
              className="bg-gray-200 input input-bordered input-info w-full p-2 my-2"
              onChange={(e) => setReplayText(e.target.value)}
              placeholder="Add a reply..."
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="outlined" size="small">
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
    </div>
  );
}

export default Question;
