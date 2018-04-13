import React from "react";
import { Route, IndexRoute } from "react-router";
import App from "./components/App";
import HomePage from "./components/home/HomePage";
import SignInForm from "./components/admin/SignInForm";
import RegisterForm from "./components/admin/RegisterForm";
import ForgottenForm from "./components/admin/ForgottenForm";
import ResetForm from "./components/admin/ResetForm";

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="signin" component={SignInForm}  />
    <Route path="register" component={RegisterForm}  />
    <Route path="forgotten" component={ForgottenForm}  />
    <Route path="reset/:resetToken" component={ResetForm}  />
  </Route>
);
