import React, { createContext, useReducer, useContext } from "react";

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const initialState = {
    polls: [],
    selectedPoll: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_POLLS":
        return { ...state, polls: action.payload };
      case "SELECT_POLL":
        return {
          ...state,
          selectedPoll: action.payload,
        };
      default:
        return state;
    }
  };

  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
