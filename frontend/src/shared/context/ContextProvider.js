import React, { createContext, useReducer } from "react";
import { initialState, reducer } from "./reducer";

const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const [globalState, globalDispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ globalState, globalDispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };
