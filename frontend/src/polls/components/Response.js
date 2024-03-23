import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { MdExpandMore } from "react-icons/md";
import { useHttpClient } from "../../shared/hooks/http-hook";

export default function Response({ response }) {
  const [expandReplies, setExpandReplies] = useState(false);
  const { sendRequest } = useHttpClient();

  return (
    <Card
      sx={{
        marginTop: 2,
        width: "90%",
        backgroundColor: "#A9E1EE",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
      }}
    >
      <div>{response.responseText}</div>
      <div>Posted by {response.author}</div>
      {response.replies && response.replies.length > 0 && (
        <button
          className="flex items-center cursor-pointer text-navy-blue"
          onClick={() => setExpandReplies(!expandReplies)}
        >
          <MdExpandMore />
          <div variant="subtitle2">{response.replies.length} replies</div>
        </button>
      )}
    </Card>
  );
}
