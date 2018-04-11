import {Router} from "express";
import DatabaseClient from "./DatabaseClient";
import bcrypt from "bcrypt";
import ApiHelpers from "./ApiHelpers";
import EmailApi from "./EmailApi";

export default class UserApi {

  static routes = () => {
    let routes = new Router();

    routes.post("/", UserApi._createUser);
    routes.post("/exists", (req, res) => {
      UserApi.userExists(req.body.email)
        .then(exists => res.statusCode(200).send(exists))
        .catch(error => ApiHelpers.handleError(error, res));
    });

    return routes;
  };

  static userExists = async (email) => {
    let client = new DatabaseClient();
    let users = await client.find(client.collectionNames.USERS, {email: email});
    return users.length === 1;
  };

  static getUser = (email) => {
    let client = new DatabaseClient();
    return client.findOne(client.collectionNames.USERS, {email: email});
  };

  static _createUser = async (req, res) => {
    try
    {
      let userModel = {
        isActiveDirectory: false,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        displayName: req.body.displayName,
        accountCreated: new Date(),
        roles: []
      };
  
      userModel.password = await bcrypt.hash(req.body.password, 10);
  
      let client = new DatabaseClient();
  
      let commandResult = await client.insertOne(client.collectionNames.USERS, userModel);
  
      delete userModel.password;
  
      if (commandResult.result.ok === 1 && commandResult.result.n === 1) {
        
        let emailApi = new EmailApi();
        await emailApi.sendWelcomeEmail(userModel);
        
        res.json(userModel);
      }
      else
        res.status(500).json(commandResult);
      
    } catch (err) {
      ApiHelpers.handleError(err, res);
    }
  };

  static createAdUser = async (domain, username, sid, model, groups) => {
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
    
    let commandResult = await client.insertOne(client.collectionNames.USERS, userModel);
    
    if (commandResult.result.ok === 1 && commandResult.result.n === 1)
      return userModel;
    else
      throw new Error(JSON.stringify(commandResult));
  }
}
