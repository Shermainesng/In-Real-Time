import React, { useState, useCallback, useRef, useEffect } from "react";

export default function useHttpClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequests = useRef([]);

  //avoid infinite loops - useCallback
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      //cancel http request if another request is made after the ongoing request is not yet complete
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const responseData = await response.json();
        console.log(responseData);
        //request is completed, can remove the request controller that is used for this request. so we won't be trying
        //to cancel a request that has alr been completed
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrol) => reqCtrol !== httpAbortCtrl
        );

        if (!response.ok) {
          console.log(responseData);
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message || "Something went wrong, please try again");
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(undefined);
  };

  useEffect(() => {
    //cleanup function
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
}
