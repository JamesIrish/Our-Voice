import {Router} from 'express';
import DatabaseClient from "./DatabaseClient";
import bcrypt from "bcrypt";

export default class UserApi {
  
  static routes = () => {
    let routes = new Router();
    routes.post('/', (req, res) => {
      UserApi.createUser(req.body)
        .then(result => {
          res.status(200).send(result);
        })
        .catch(error => {
          console.error(error);
          res.status(500).send(error);
        });
    });
    return routes;
  };
  
  static createUser = (model) => {
    let userModel = {
      email: model.email,
      firstName: model.firstName,
      lastName: model.lastName,
      displayName: model.displayName
    };
    
    return new Promise((resolve, reject) => {
      bcrypt.hash(model.password, 10)
        .then(hash => {
          userModel.password = hash;
          let client = new DatabaseClient();
          client.insertOne('users', userModel)
            .then(commandResult => {
              delete userModel.password;
              if (commandResult.result.ok === 1 && commandResult.result.n === 1)
                resolve(userModel);
              else
                resolve(commandResult);
            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
    });
  }
}
