import {combineReducers} from "redux";
import ajaxCallsInProgress from "./ajaxStatusReducer";
import config from "./configReducer";
import snack from "./snackReducer";
import auth from "./authReducer";

const rootReducer = combineReducers({
  ajaxCallsInProgress,
  config,
  snack,
  auth
});

export default rootReducer;
