import * as types from "./actionTypes";
import AuthApi from "../api/AuthApi";

export function signInSuccess(auth) {
  return { type: types.SIGN_IN_SUCCESS, auth: auth };
}
export function signInError(error) {
  return { type: types.SIGN_IN_ERROR, error: error };
}

export function signInUser(credentials) {
  return function(dispatch) {
    dispatch({ type: types.AUTH_LOADING });
    return AuthApi.authenticateUser(credentials)
      .then(auth => dispatch(signInSuccess(auth)))
      .catch(error => dispatch(signInError(error)));
  };
}

export function refreshTokenSuccess(auth) {
  return { type: types.REFRESH_TOKEN_SUCCESS, auth: auth };
}
export function refreshTokenError(error) {
  return { type: types.REFRESH_TOKEN_ERROR, error: error };
}

export function refreshToken(email, refreshToken) {
  return function(dispatch) {
    dispatch({ type: types.AUTH_LOADING });
    return AuthApi.getAccessToken(email, refreshToken)
      .then(auth => dispatch(refreshTokenSuccess(auth)))
      .catch(error => dispatch(refreshTokenError(error)));
  };
}
