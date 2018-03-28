/*eslint-disable import/default */
import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { Router, browserHistory } from "react-router";
import { Provider } from "react-redux";

render(
<h3>Welcome to Voice!</h3>,
document.getElementById("app")
);
