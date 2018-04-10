import {Router} from "express";
import DatabaseClient from "./DatabaseClient";
import bcrypt from "bcrypt";
import AuthApi from "./AuthApi";

export default class UserApi {

  static routes = () => {
    let routes = new Router();

    routes.post("/", UserApi._createUser);
    routes.post("/exists", (req, res) => {
      UserApi._userExists(req.body.email)
        .then(exists => res.statusCode(200).send(exists))
        .catch(error => AuthApi._handleError(error, res));
    });

    return routes;
  };

  static _userExists = (email) => {
    return new Promise((resolve, reject) => {
      let client = new DatabaseClient();
      client.find(client.collectionNames.USERS, {email: email})
        .then(users => resolve(users.length === 1))
        .catch(error => reject(error));
    });
  };

  static _getUser = (email) => {
    let client = new DatabaseClient();
    return client.findOne(client.collectionNames.USERS, {email: email});
  };

  static _createUser = (req, res) => {
    let userModel = {
      isActiveDirectory: false,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      displayName: req.body.displayName,
      accountCreated: new Date(),
      roles: []
    };

    bcrypt.hash(req.body.password, 10)
      .then(hash =>
      {
        userModel.password = hash;

        let client = new DatabaseClient();

        client.insertOne(client.collectionNames.USERS, userModel)
          .then(commandResult =>
          {
            delete userModel.password;

            if (commandResult.result.ok === 1 && commandResult.result.n === 1)
              res.json(userModel);
            else
              res.status(500).json(commandResult);
          })
          .catch(error => res.status(500).json(error));
      })
      .catch(error => res.status(500).json(error));
  }

  static _createAdUser = (domain, username, sid, model, groups) => {
    return new Promise((resolve, reject) =>
    {
      let userModel = {
        isActiveDirectory: true,
        domain: domain,
        sid: sid,
        username: username,
        email: model.mail,
        firstName: model.givenName,
        lastName: model.sn,
        displayName: model.displayName,
        accountCreated: new Date(),
        roles: groups || []
      };

      let client = new DatabaseClient();
      client.insertOne(client.collectionNames.USERS, userModel)
        .then(commandResult => {
          if (commandResult.result.ok === 1 && commandResult.result.n === 1)
            resolve(userModel);
          else
            reject(commandResult);
        })
        .catch(error => reject(error));
    });
  }
}
