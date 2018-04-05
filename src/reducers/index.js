import {combineReducers} from "redux";
import ajaxCallsInProgress from "./ajaxStatusReducer";
import snackReducer from "./snackReducer";

const rootReducer = combineReducers({
  snackReducer,
  ajaxCallsInProgress
});

export default rootReducer;
