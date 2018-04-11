import {Router} from "express";
import DatabaseClient from "./DatabaseClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import randtoken from "rand-token";
import NodeSSPI from "node-sspi";
import ActiveDirectory from "activedirectory";
import config from "../config/index";
import UserApi from "./UserApi";
import ApiHelpers from "./ApiHelpers";

export default class AuthApi {

  static SECRET = "VOICE_SECRET";

  static routes = () => {
    let routes = new Router();

    routes.post("/token", AuthApi._token);
    routes.post("/refresh", AuthApi._refresh);
    routes.post("/sspi", function (req, res, next) {
      let nodeSSPIObj = new NodeSSPI({
        retrieveGroups: true,
        offerBasic: false
      });
      nodeSSPIObj.authenticate(req, res, function(err){
        if (err) ApiHelpers.handleError(err, res);
        else res.finished || next();
      });
    }, AuthApi._sspi);

    return routes;
  };

  static _createToken = (userModel, rolesArray) => {
    let tokenModel = {
      "user": userModel,
      "roles": rolesArray
    };
    return jwt.sign(tokenModel, AuthApi.SECRET, { expiresIn: 300 });
  };

  static _token = async (req, res) => {
    try
    {
      let email = req.body.email;
      let password = req.body.password;

      let client = new DatabaseClient();
      let user = await client.findOne(client.collectionNames.USERS, {email: email});

      let match = await bcrypt.compare(password, user.password);

      if (match)
      {
        console.log(`User ${email} authenticated.`);

        delete user.password;

        let token = AuthApi._createToken(user, ["admin"]);
        let refreshToken = randtoken.uid(256);

        let midnight = new Date();
        midnight.setDate(midnight.getDate() + 1);
        midnight.setHours(0, 0, 0, 0);

        let refreshTokenDb = {
          created: new Date(),
          expires: midnight,
          email: user.email,
          refreshToken: refreshToken
        };

        let commandResult = await client.insertOne(client.collectionNames.REFRESH_TOKENS, refreshTokenDb);

        if (commandResult.result.ok === 1 && commandResult.result.n === 1)
        {
          res.cookie("access_token", token);
          res.cookie("refresh_token", refreshToken);
          res.status(200).send({user: user, accessToken: token, refreshToken: refreshToken});
        }
        else
          ApiHelpers.handleError(new Error(JSON.stringify(commandResult), res));

      }
      else
        res.sendStatus(401);

    } catch(err) {
      ApiHelpers.handleError(err, res);
    }
  };

  static _refresh = async (req, res) => {
    try
    {
      let email = req.body.email;
      let refreshToken = req.body.refreshToken;

      let client = new DatabaseClient();
      let refreshTokens = await client.find(client.collectionNames.REFRESH_TOKENS,
      {
        refreshToken: refreshToken,
        email: email
      });

      let okay = false;
      let now = new Date();

      for (let t = 0; t < refreshTokens.length; t++) {
        let refreshToken = refreshTokens[t];
        if (refreshToken.expires < now) {
          await client.deleteOne(refreshToken._id);
        } else {
          okay = true;
        }
      }

      if (okay)
      {
        let user = await client.findOne(client.collectionNames.USERS, {email: email});

        delete user.password;

        let token = AuthApi._createToken(user, ["admin"]);
        res.cookie("access_token", token);
        res.status(200).send({user: user, accessToken: token});
      }
      else
        res.sendStatus(401);

    } catch(err) {
      ApiHelpers.handleError(err, res);
    }
  };

  static _sspi = async (req, res) => {
    try
    {
      // Tidy inputs
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

      // Query AD for user's names & email address  MUST BE CALLBACK
      let ad = new ActiveDirectory(config.activeDirectory.config);
      ad.findUser(username, async (err, aduser) =>
      {
        if (err) ApiHelpers.handleError(err, res);
        else
        {
          let user = null;

          // Either get the user from mongo or create them if this is the first time we've seen them
          if (await UserApi.userExists(aduser.mail))
            user = await UserApi.getUser(aduser.email);
          else
            user = await UserApi.createAdUser(domain, username, sid, aduser, groups);

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

          let client = new DatabaseClient();

          let commandResult = await client.insertOne(client.collectionNames.REFRESH_TOKENS, refreshTokenDb);

          if (commandResult.result.ok === 1 && commandResult.result.n === 1)
          {
            res.cookie("access_token", token);
            res.cookie("refresh_token", refreshToken);
            res.status(200).send({ user: user, accessToken: token, refreshToken: refreshToken });
          }
          else
            throw new Error(JSON.stringify(commandResult));
      }});

    } catch(err){
        ApiHelpers.handleError(err, res);
    }
  }
}
