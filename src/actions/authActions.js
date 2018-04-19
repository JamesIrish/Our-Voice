import * as types from "./actionTypes";
import AuthApi from "../api/AuthApi";
import UserApi from "../api/UserApi";

export function createUserSuccess(info) {
  return { type: types.CREATE_USER_SUCCESS, info: info };
}
export function createUserError(error) {
  return { type: types.CREATE_USER_ERROR, error: error };
}
export function createUser(newUser) {
  return function(dispatch) {
    dispatch({ type: types.AUTH_LOADING });
    return UserApi.createUser(newUser)
      .then(info => dispatch(createUserSuccess(info)))
      .catch(error => dispatch(createUserError(error)));
  };
}

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

export function checkPasswordResetTokenSuccess(info) {
  return { type: types.CHECK_PASSWORD_RESET_TOKEN_SUCCESS, info: info };
}
export function checkPasswordResetTokenError(error) {
  return { type: types.CHECK_PASSWORD_RESET_TOKEN_ERROR, error: error };
}

export function checkPasswordResetToken(resetPasswordToken) {
  return function(dispatch) {
    return AuthApi.checkPasswordResetToken(resetPasswordToken)
      .then(info => dispatch(checkPasswordResetTokenSuccess(info)))
      .catch(error => dispatch(checkPasswordResetTokenError(error)));
  };
}

export function resetComplete() {
  return { type: types.PASSWORD_RESET_COMPLETE };
}
export function resetError(error) {
  return { type: types.PASSWORD_RESET_ERROR, error: error };
}
export function resetPassword(passwordResetToken, newPassword) {
  return function(dispatch) {
    dispatch({ type: types.AUTH_LOADING });
    return AuthApi.resetPassword(passwordResetToken, newPassword)
      .then(info => {
        console.log("Reset password complete", info);
        dispatch(resetComplete());
      })
      .catch(error => dispatch(resetError(error)));
  };
}
