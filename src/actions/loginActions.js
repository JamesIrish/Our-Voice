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
export function signInAdUser() {
  return function(dispatch) {
    dispatch({ type: types.AUTH_LOADING });
    return AuthApi.authenticateUserAd()
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

export function refreshToken(userId, refreshToken) {
  return function(dispatch) {
    dispatch({ type: types.AUTH_LOADING });
    return AuthApi.getAccessToken(userId, refreshToken)
      .then(auth => dispatch(refreshTokenSuccess(auth)))
      .catch(error => dispatch(refreshTokenError(error)));
  };
}

export function forgottenComplete() {
  return { type: types.FORGOTTEN_COMPLETE };
}

export function forgotten(email) {
  return function(dispatch) {
    dispatch({ type: types.AUTH_LOADING });
    return AuthApi.forgotten(email)
      .then(() => dispatch(forgottenComplete()))
      .catch(() => dispatch(forgottenComplete()));
  };
}
