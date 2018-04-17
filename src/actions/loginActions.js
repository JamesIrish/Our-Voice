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

export function resetTokenOkay(info) {
  return { type: types.PASSWORD_RESET_TOKEN_OKAY, info: info };
}
export function resetTokenExpired(error) {
  return { type: types.PASSWORD_RESET_TOKEN_EXPIRED, error: error };
}

export function checkResetPasswordToken(resetPasswordToken) {
  return function(dispatch) {
    return AuthApi.checkResetPasswordToken(resetPasswordToken)
      .then(info => dispatch(resetTokenOkay(info)))
      .catch(error => dispatch(resetTokenExpired(error)));
  };
}

export function resetComplete() {
  return { type: types.PASSWORD_RESET_COMPLETE };
}
export function resetError(error) {
  return { type: types.PASSWORD_RESET_ERROR, error: error };
}
export function reset(email) {
  return function(dispatch) {
    return AuthApi.forgotten(email)
      .then(() => dispatch(resetComplete()))
      .catch(error => dispatch(resetError(error)));
  };
}
