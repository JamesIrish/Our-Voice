import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function snackReducer(state = initialState.snack, action) {
  switch(action.type) {
    case types.SHOW_SNACK:
      return Object.assign({}, {
        snackOpen: true,
        snackMessage: action.text
      });
    case types.CLEAR_SNACK:
      return Object.assign({}, {
        snackOpen: false,
        snackMessage: ""
      });
    case types.SIGN_IN_SUCCESS:
      return Object.assign({}, {
        snackOpen: true,
        snackMessage: `Welcome back ${action.auth.user.firstName}`
      });
    case types.SIGN_IN_ERROR:
      return Object.assign({}, {
        snackOpen: true,
        snackMessage: "Error signing in"
      });
    default:
      return state;
  }
}
