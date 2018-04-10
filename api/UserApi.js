import {Router} from "express";
import DatabaseClient from "./DatabaseClient";
import bcrypt from "bcrypt";

export default class UserApi {
  
  static routes = () => {
    let routes = new Router();
    
    routes.post("/", UserApi._createUser);
    
    return routes;
  };
  
  static _createUser = (req, res) => {
    let userModel = {
      isActiveDirectory: false,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      displayName: req.body.displayName,
      accountCreated: new Date()
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
}
