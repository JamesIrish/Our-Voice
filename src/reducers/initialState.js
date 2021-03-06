export default {
  ajaxCallsInProgress: 0,

  config: {
    loading: true,
    error: null
  },

  auth: {
    loading: false,
    error: null,
    user: null,
    roles: [],
    accessToken: null,
    refreshToken: null,
    passwordResetTokenOkay: null,
    passwordResetTokenError: null,
    redirectTo: null
  },

  snack: {
    snackOpen: false,
    snackMessage: null
  }
};
