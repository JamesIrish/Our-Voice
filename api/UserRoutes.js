import {Router} from "express";
import bcrypt from "bcrypt";
import Helpers from "./Helpers";
import EmailApi from "./EmailApi";
import UserApi from "./UserApi";
import * as userActions from "./UserActions";

export default class UserRoutes {

  static routes = () => {
    let routes = new Router();

    routes.post("/", UserRoutes._createUser);

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

      let userApi = new UserApi();
      await userApi.initialise();

      userModel.actions = [{ action: userActions.created }];

      await userApi.createUser(userModel);

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

}
