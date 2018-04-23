/*eslint-disable import/default */

import "./styles/styles.css";
import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { Router, browserHistory } from "react-router";
import { Provider } from "react-redux";
import routes from "./routes";
import configureStore from "./store/configureStore";
import {loadConfig} from "./actions/configActions";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import initialState from "./reducers/initialState";

// Look for authentication cookies before the react app starts up
let user = null;
let roles = [];
try {
  let accessToken = Cookies.get("access_token");
  let refreshToken = Cookies.get("refresh_token");
  if (accessToken && refreshToken && accessToken !== "j:null" && refreshToken !== "j:null") {
    let decoded = jwtDecode(accessToken);
    user = decoded.user;
    roles = decoded.roles;
  }
}catch (e) {
  console.error("Error parsing cookies", e);
}

// Combine the values read from the cookies with the vanilla initial auth state
let authWithCookies = Object.assign({}, initialState.auth, { user: user, roles: roles });
let stateWithAuth = Object.assign({}, initialState, { auth: authWithCookies });

// Pass that initial state into Redux
const store = configureStore(stateWithAuth);
store.dispatch(loadConfig());

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById("app")
);
