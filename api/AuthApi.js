import {Router} from "express";
import DatabaseClient from "./DatabaseClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import randtoken from "rand-token";

export default class AuthApi {
  
  static SECRET = "VOICE_SECRET";
  
  static routes = () => {
    let routes = new Router();
    
    routes.post("/token", AuthApi._token);
    routes.post("/refresh", AuthApi._refresh);
    
    return routes;
  };
  
  static _handleError = (error, res) => {
    console.log(error);
    res.status(500).send(error);
  };
  
  static _createToken = (userModel, rolesArray) => {
    let tokenModel = {
      "user": userModel,
      "roles": rolesArray
    };
    return jwt.sign(tokenModel, AuthApi.SECRET, { expiresIn: 300 });
  };
  
  static _token = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    
    let client = new DatabaseClient();
    client.findOne(client.collectionNames.USERS, { email: email })
      .then(user =>
      {
        bcrypt.compare(password, user.password)
          .then(match =>
          {
            if (match)
            {
              console.log(`User ${email} authenticated.`);
              
              delete user.password;
            
              let token = AuthApi._createToken(user, ["admin"]);
              let refreshToken = randtoken.uid(256);
            
              let midnight = new Date();
              midnight.setDate(midnight.getDate() + 1);
              midnight.setHours(0,0,0,0);
            
              let refreshTokenDb = {
                created: new Date(),
                expires: midnight,
                email: user.email,
                refreshToken: refreshToken
              };
              client.insertOne(client.collectionNames.REFRESH_TOKENS, refreshTokenDb)
                .then(commandResult =>
                {
                  if (commandResult.result.ok === 1 && commandResult.result.n === 1) {
                    res.cookie("access_token", token);
                    res.cookie("refresh_token", refreshToken);
                    res.sendStatus(200);
                } else
                    AuthApi._handleError(commandResult);
                })
                .catch(error => AuthApi._handleError(error, res));
            }
            else
              res.sendStatus(401);
          })
          .catch(error => AuthApi._handleError(error, res));
      })
      .catch(error => AuthApi._handleError(error, res));
  };
  
  static _refresh = (req, res) => {
    let email = req.body.email;
    let refreshToken = req.body.refreshToken;
  
    let client = new DatabaseClient();
    client.find(client.collectionNames.REFRESH_TOKENS, { refreshToken: refreshToken, email: email })
      .then(refreshTokens =>
      {
        let okay = false;
        let now = new Date();
        
        let deletePromises = [];
        for (let t = 0; t < refreshTokens.length; t++) {
          let refreshToken = refreshTokens[t];
          if (refreshToken.expires < now) {
            deletePromises.push(client.deleteOne(refreshToken._id));
          } else {
            okay = true;
          }
        }
        
        Promise.all(deletePromises)
          .then(deletes => {
            console.log(deletes);
            if (okay) {
              
              client.find(client.collectionNames.USERS, { email: email })
                .then(users => {
                  if (users.length === 0)
                  {
                    res.sendStatus(401);
                  }
                  else if (users.length > 1)
                  {
                    AuthApi._handleError("Multiple users found", res);
                  }
                  else
                  {
                    let user = users[0];
                    delete user.password;
                    let token = AuthApi._createToken(user, ["admin"]);
                    res.cookie('jwt', token);
                    res.sendStatus(200);
                  }
                })
                .catch(error => AuthApi._handleError(error, res));
            } else {
              res.sendStatus(401);
            }
          })
          .catch(error => AuthApi._handleError(error, res));
      })
      .catch(error => AuthApi._handleError(error, res));
  }
}
