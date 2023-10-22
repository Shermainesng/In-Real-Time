import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";

const fetchData = async (nextPageNo) => {
  try {
    const response = await axios(
      `https://randomuser.me/api?page=${nextPageNo}`
    );
    // const result = await JSON.stringify(response.data.results[0]);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response);
  }
};

export default function NewPoll() {
  const [counter, setCounter] = useState(0);
  const [allDataJSON, setAllDataJSON] = useState("");
  const [nextPageNo, setNextPageNo] = useState(1);
  const [userInfos, setUserInfos] = useState([]);

  const fetchNextUser = () => {
    console.log("fetchNextUser called");
    try {
      fetchData(nextPageNo).then((randomData) => {
        const newUserInfos = [...userInfos, ...randomData.results];
        setUserInfos(newUserInfos);
        setNextPageNo(randomData.info.page + 1);
      });
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    fetchNextUser();
  }, []);

  return (
    <React.Fragment>
      <div>hello new poll</div>
    </React.Fragment>
  );
}
