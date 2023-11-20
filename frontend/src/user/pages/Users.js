import React, { useEffect, useState } from "react";

export default function Users() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        // const response = await fetch(`http://localhost:7005/api/users`);
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedUsers(responseData.users);
      } catch (err) {
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  const errorHandler = () => {
    setError(null);
  };
  return <div></div>;
}
