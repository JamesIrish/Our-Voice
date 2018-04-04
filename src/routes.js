import React from "react";
import { Route, IndexRoute } from "react-router";
import App from "./components/App";
import Auth from "./auth";
import HomePage from "./components/home/HomePage";
import SignInForm from "./components/admin/SignInForm";
import RegisterForm from "./components/admin/RegisterForm";

/*eslint-disable react/jsx-no-bind*/

const auth = new Auth();



export default (
  <Route path="/" component={App}>
    <IndexRoute component={(props) => <HomePage auth={auth} {...props} />} />
    <Route path="signin" component={(props) => <SignInForm auth={auth} {...props} />}  />
    <Route path="register" component={(props) => <RegisterForm auth={auth} {...props} />}  />
  </Route>
);
