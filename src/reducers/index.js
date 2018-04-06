import {combineReducers} from "redux";
import ajaxCallsInProgress from "./ajaxStatusReducer";
import snack from "./snackReducer";
import auth from "./authReducer";

const rootReducer = combineReducers({
  ajaxCallsInProgress,
  snack,
  auth
});

export default rootReducer;
