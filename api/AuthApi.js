import {Router} from 'express';
import DatabaseClient from "./DatabaseClient";
import bcrypt from "bcrypt";

export default class AuthApi {
  
  static routes = () => {
    let routes = new Router();
    routes.post('/', (req, res) => {
      AuthApi.authenticateUser(req.body)
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
  
  static authenticateUser = (model) => {
    return new Promise((resolve, reject) => {
      let client = new DatabaseClient();
      client.find('users', { email: model.email })
        .then(users => {
          if (users.length !== 1) {
            reject('Multiple users found');
          } else {
            let user = users[0];
            bcrypt.compare(model.password, user.password)
              .then(match => {
                if (match)
                {
                  delete user.password;
                  resolve(user);
                }
                else
                  reject('Invalid credentials');
              })
              .catch(error => reject(error));
            }
        })
        .catch(error => reject(error));
    });
  }
}
