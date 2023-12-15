import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [userName, setUserName] = useState(false);

  const login = useCallback((userId, userName, token, expirationDate) => {
    console.log("reached login in auth-hook");
    setToken(token);
    setUserId(userId);
    setUserName(userName);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); //generate a date obj of 1 hr from now
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        //turn object into text - to store 'obj' as text in local storage
        userId: userId,
        userName: userName,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  //automatically log out user after token expires
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const reminaingTime =
        tokenExpirationDate.getTime() - new Date().getTime(); //in milliseconds
      logoutTimer = setTimeout(logout, reminaingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData")); //text - convert to object
    console.log(storedData);
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.userName,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId, userName };
};
