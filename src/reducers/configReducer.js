import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function configReducer(state = initialState.config, action) {
  switch(action.type) {
    case types.CONFIG_LOAD_SUCCESS:
      return Object.assign({}, { loading: false, error: null }, action.config);
    case types.CONFIG_LOAD_ERROR:
      return Object.assign({}, { loading: false }, { error: action.error });
    default:
      return state;
  }
}
