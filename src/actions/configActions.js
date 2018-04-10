import * as types from "./actionTypes";
import ConfigApi from "../api/ConfigApi";

export function configLoadSuccess(config) {
  return { type: types.CONFIG_LOAD_SUCCESS, config: config };
}
export function configLoadError(error) {
  return { type: types.CONFIG_LOAD_ERROR, error: error };
}

export function loadConfig() {
  return function(dispatch) {
    return ConfigApi.getConfig()
      .then(config => dispatch(configLoadSuccess(config)))
      .catch(error => dispatch(configLoadError(error)));
  };
}
