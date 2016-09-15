import * as types from '../actions/actionTypes';

const initialState = {
  count: 0
};

export function counter(state = initialState, action = {}) {

  // alert(JSON.stringify(state)+' : '+JSON.stringify(action));

  switch (action.type) {
    case types.INCREMENT:
      return {
        ...state,
        count: state.count + 1
      };
    case types.DECREMENT:
      return {
        ...state,
        count: state.count - 1
      };
    default:
      return state;
  }
}
