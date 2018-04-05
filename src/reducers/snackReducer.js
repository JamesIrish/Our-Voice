import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function snackReducer(state = initialState.snackReducer, action) {
  if (action.type == types.SHOW_SNACK) {
    return {
      snackOpen: true,
      snackMessage: action.text
    };
  }
  
  return state;
}
