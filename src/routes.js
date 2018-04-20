import React from "react";
import { Route, IndexRoute } from "react-router";
import App from "./components/App";
import NotFound from "./components/NotFound";
import HomePage from "./components/home/HomePage";
import SignInForm from "./components/admin/SignInForm";
import RegisterForm from "./components/admin/RegisterForm";
import ForgottenForm from "./components/admin/ForgottenForm";
import ResetForm from "./components/admin/ResetForm";
import AccountPage from "./components/account/AccountPage";
import AvatarPage from "./components/account/AvatarPage";
import ProfilePage from "./components/account/ProfilePage";
import ActivityPage from "./components/account/ActivityPage";
import PasswordPage from "./components/account/PasswordPage";
import EnsureSignedInContainer from "./components/EnsureSignedInContainer";

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
    <Route path="/signin" component={SignInForm}/>
    <Route path="/register" component={RegisterForm}/>
    <Route path="/forgotten" component={ForgottenForm}/>
    <Route path="/reset/:resetToken" component={ResetForm}/>

    <Route component={EnsureSignedInContainer}>

      <Route path="/account" component={AccountPage}>
        <IndexRoute component={ProfilePage}/>
        <Route path="/account/profile" component={ProfilePage}/>
        <Route path="/account/avatar" component={AvatarPage}/>
        <Route path="/account/activity" component={ActivityPage}/>
        <Route path="/account/password" component={PasswordPage}/>
      </Route>

    </Route>

    <Route component={NotFound} />
  </Route>
);
