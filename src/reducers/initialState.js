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
    accessToken: null,
    refreshToken: null
  },
  
  snack: {
    snackOpen: false,
    snackMessage: null
  }
};
