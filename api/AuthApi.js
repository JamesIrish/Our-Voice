import {Router} from "express";
import DatabaseClient from "./DatabaseClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import randtoken from "rand-token";
import nodeSSPI from "node-sspi";
import ActiveDirectory from "activedirectory";
import config from "../config/index";
import UserApi from "./UserApi";

export default class AuthApi {

  static SECRET = "VOICE_SECRET";

  static routes = () => {
    let routes = new Router();

    routes.post("/token", AuthApi._token);
    routes.post("/refresh", AuthApi._refresh);
    routes.get("/sspi", function (req, res, next) {
      let nodeSSPIObj = new nodeSSPI({
        retrieveGroups: true,
        offerBasic: false
      });
      nodeSSPIObj.authenticate(req, res, function(err){
        if (err) AuthApi._handleError(err, res);
        else res.finished || next();
      });
    }, AuthApi._sspi);

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
                    res.status(200).send({ user: user, accessToken: token, refreshToken: refreshToken });
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
            if (okay) {

              client.findOne(client.collectionNames.USERS, { email: email })
                .then(user =>
                {
                  delete user.password;

                  let token = AuthApi._createToken(user, ["admin"]);
                  res.cookie('access_token', token);
                  res.status(200).send({ user: user, accessToken: token });
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

  static _sspi = (req, res) =>
  {
    // Tidy inputs a bit
    let usernameWithDomain = req.connection.user;
    let sid = req.connection.userSid;
    let groups = req.connection.userGroups;
    let domain = null;
    let username = null;
    let unBackslash = usernameWithDomain.indexOf("\\");
    let unAtSymbol = usernameWithDomain.indexOf("@");
    if (unBackslash !== -1) {
      domain = usernameWithDomain.substr(0, unBackslash);
      username = usernameWithDomain.substring(unBackslash + 1);
    } else if (unAtSymbol !== -1) {
      domain = usernameWithDomain.substring(unAtSymbol + 1);
      username = usernameWithDomain.substr(0, unAtSymbol);
    } else {
      username = usernameWithDomain;
    }
    username = username.toLowerCase();

    console.log(`User ${domain}\\${username} authenticated`);

    // Query AD for user's names & email address
    let ad = new ActiveDirectory(config.activeDirectory.config);
    ad.findUser(username, (err, user) => {
      if (err) AuthApi._handleError(err);
      else
      {
        // Test if this user exists in MongoDb already?
        if (UserApi._userExists(user.mail)) {

          let token = AuthApi._createToken(user, groups);
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
                res.status(200).send({ user: user, accessToken: token, refreshToken: refreshToken });
              } else
                AuthApi._handleError(commandResult);
            })
            .catch(error => AuthApi._handleError(error, res));


        } else {

          UserApi._createAdUser(domain, username, sid, user, groups)
            .then(dbModel => {

            })
            .catch(error => AuthApi._handleError(error, res));

        }
      }
    });

  }
}
