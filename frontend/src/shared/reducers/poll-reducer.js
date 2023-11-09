export const initialState = {
  selectedPoll: null,
  // ... other state properties
};

export const actionTypes = {
  SELECT_POLL: "SELECT_POLL",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SELECT_POLL:
      return {
        ...state,
        selectedPoll: action.payload,
      };
    // ... other cases
    default:
      return state;
  }
};

export default reducer;
