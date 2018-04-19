import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function snackReducer(state = initialState.snack, action) {
  switch(action.type) {
    case types.SHOW_SNACK:
      return { ...state, snackOpen: true, snackMessage: action.text };
      
    case types.CLEAR_SNACK:
      return { ...state, snackOpen: false, snackMessage: "" };
      
    case types.CREATE_USER_SUCCESS:
      return { ...state, snackOpen: true, snackMessage: "User account created. Please sign in." };
      
    case types.CREATE_USER_ERROR:
      return { ...state, snackOpen: true, snackMessage: "An error occurred. Do you already have an account?" };
      
    case types.SIGN_IN_SUCCESS:
      return { ...state, snackOpen: true, snackMessage: `Welcome back ${action.auth.user.firstName}` };
      
    case types.SIGN_IN_ERROR:
      return { ...state, snackOpen: true, snackMessage: "Error signing in, do you have an account?" };
      
    case types.FORGOTTEN_COMPLETE:
      return { ...state, snackOpen: true, snackMessage: "Instructions have been emailed to you." };
      
    case types.PASSWORD_RESET_COMPLETE:
      return { ...state, snackOpen: true, snackMessage: "Password reset. Please sign in." };
      
    default:
      return state;
  }
}
