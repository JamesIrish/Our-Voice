/*eslint-disable import/default */
import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { Router, browserHistory } from "react-router";
import { Provider } from "react-redux";

render(
<h1>Hello</h1>,
document.getElementById("app")
);
