import * as types from "../actions/actionTypes";
import initialState from "./initialState";
import {browserHistory} from "react-router";

export default function authenticationReducer(state = initialState.auth, action) {
  switch(action.type) {
    case types.AUTH_LOADING:
      return {...state, loading: true };

    case types.CREATE_USER_SUCCESS:
    {
      browserHistory.push("/signin");
      return { ...initialState.auth };
    }

    case types.CLEAR_REDIRECTION:
      return { ...state, redirectTo: null };

    case types.SIGN_IN_SUCCESS:
    case types.FORGOTTEN_COMPLETE:
    {
      if (action.redirect)
        return { ...initialState.auth, ...action.auth, redirectTo: action.redirect };

      browserHistory.push("/");
      return { ...initialState.auth, ...action.auth };
    }
    case types.REFRESH_TOKEN_SUCCESS:
      return { ...initialState.auth, ...action.auth };

    case types.CREATE_USER_ERROR:
    case types.SIGN_IN_ERROR:
    case types.SIGN_OUT_ERROR:
    case types.REFRESH_TOKEN_ERROR:
    case types.CHECK_PASSWORD_RESET_TOKEN_ERROR:
    case types.PASSWORD_RESET_ERROR:
      return { ...initialState.auth, error: action.error };

    case types.CHECK_PASSWORD_RESET_TOKEN_SUCCESS:
      return { ...initialState.auth, passwordResetTokenOkay: action.info.okay, passwordResetTokenError: action.info.reason };

    case types.PASSWORD_RESET_COMPLETE:
      if (action.info && action.info.okay === true)
      {
        browserHistory.push("/signin");
        return { ...initialState.auth };
      }
      else
        return { ...initialState.auth, passwordResetTokenOkay: action.info.okay, passwordResetTokenError: action.info.reason };

    case types.SIGN_OUT_SUCCESS:
    {
      browserHistory.push("/");
      return { ...initialState.auth };
    }

    default:
      return state;
  }
}
