//reducer for selected poll
const initialState = {
  selectedPoll: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SELECTED_POLL":
      return { ...state, selectedPoll: action.payload };
    default:
      return state;
  }
};

export { initialState, reducer };
