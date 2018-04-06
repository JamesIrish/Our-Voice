import * as types from "../actions/actionTypes";
import initialState from "./initialState";
import {browserHistory} from "react-router";

export default function authenticationReducer(state = initialState.auth, action) {
  switch(action.type) {
    case types.AUTH_LOADING:
      return Object.assign({}, { loading: true });
    case types.SIGN_IN_SUCCESS:
    {
      browserHistory.push("/");
      return Object.assign({}, { loading: false, error: null }, action.auth);
    }
    case types.REFRESH_TOKEN_SUCCESS:
      return Object.assign({}, { loading: false, error: null }, action.auth);
      
    case types.SIGN_IN_ERROR:
    case types.REFRESH_TOKEN_ERROR:
    {
      return Object.assign({},
        {
          loading: false,
          user: null,
          accessToken: null,
          refreshToken: null
        },
        {
          error: action.error
        });
    }
    default:
      return state;
  }
}
