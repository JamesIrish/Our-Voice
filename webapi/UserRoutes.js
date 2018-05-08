import {Router} from "express";
import bcrypt from "bcrypt";
import Helpers from "./Helpers";
import EmailApi from "./EmailApi";
import UserApi from "./UserApi";
import * as userActions from "./UserActions";

export default class UserRoutes {

  static routes = (passport) => {
    let routes = new Router();

    routes.post("/", UserRoutes._createUser);
    routes.get("/activity", passport.authenticate("jwt"), UserRoutes._getActivity);

    return routes;
  };

  static _createUser = async (req, res) => {
    try
    {
      let userModel =
      {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        displayName: req.body.displayName,
        roles: []
      };

      userModel.password = await bcrypt.hash(req.body.password, 10);

      userModel.actions = [{ action: userActions.created }];

      await UserApi.createUser(userModel);

      delete userModel.password;

      let emailApi = new EmailApi();
      await emailApi.sendWelcomeEmail(userModel);

      res.json(userModel);
    }
    catch (err)
    {
      Helpers.handleError(err, req, res);
    }
  };

  static _getActivity = async (req, res) => {
    try
    {
      console.log(req.user);
      let user = await UserApi.findOne({_id: req.user.userId});
      res.send(user.activity);
    }
    catch (err)
    {
      Helpers.handleError(err, req, res);
    }
  };

}
