import {Router} from "express";
import os from "os";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import randtoken from "rand-token";
import ActiveDirectory from "activedirectory";
import config from "../config/index";
import UserApi from "./UserApi";
import Helpers from "./Helpers";
import EmailApi from "./EmailApi";
import TokenApi from "./TokenApi";

export default class AuthRoutes {

  static SECRET = "VOICE_SECRET";

  static routes = () => {
    let routes = new Router();
  
    routes.post("/login", AuthRoutes._login);
    routes.post("/refresh", AuthRoutes._refresh);
    routes.post("/forgotten", AuthRoutes._forgotten);
    routes.post("/checkPasswordResetToken", AuthRoutes._checkPasswordResetToken);
    
    if (os.platform() === "win32") {
      routes.post("/sspi", function (req, res, next) {
        let NodeSSPI = require("node-sspi");
        let nodeSSPIObj = new NodeSSPI({
          retrieveGroups: true,
          offerBasic: false
        });
        nodeSSPIObj.authenticate(req, res, function (err) {
          if (err) Helpers.handleError(err, res);
          else res.finished || next();
        });
      }, AuthRoutes._sspi);
    }

    return routes;
  };

  static _createToken = (userModel, rolesArray) => {
    let tokenModel = {
      "user": userModel,
      "roles": rolesArray
    };
    return jwt.sign(tokenModel, AuthRoutes.SECRET, { expiresIn: 300 });
  };

  static _login = async (req, res) => {
    try
    {
      let email = req.body.email;
      let password = req.body.password;

      let userApi = new UserApi();
      await userApi.initialise();
      
      let user = await userApi.findOne({email: email});

      let match = await bcrypt.compare(password, user.password);

      if (match)
      {
        console.log(`User ${email} authenticated.`);
        
        user.actions = [...user.actions, {action: userApi.actions.loginSuccess}];
        await user.save();

        delete user.password;

        let token = AuthRoutes._createToken(user, ["admin"]);
        let refreshToken = randtoken.uid(256);

        let midnight = new Date();
        midnight.setDate(midnight.getDate() + 1);
        midnight.setHours(0, 0, 0, 0);

        let refreshTokenDb =
        {
          userId: user._id,
          expires: midnight,
          refreshToken: refreshToken
        };

        let tokenApi = new TokenApi();
        await tokenApi.initialise();
        
        await tokenApi.createRefreshToken(refreshTokenDb);
        
        res.cookie("access_token", token);
        res.cookie("refresh_token", refreshToken);
        res.status(200).send({user: user, accessToken: token, refreshToken: refreshToken});
      }
      else
      {
        user.actions = [...user.actions, {action: userApi.actions.loginFailure}];
        await user.save();
        
        res.sendStatus(401);
      }
    }
    catch(err)
    {
      Helpers.handleError(err, res);
    }
  };

  static _refresh = async (req, res) => {
    try
    {
      let userApi = new UserApi();
      await userApi.initialise();
      
      let userId = req.body.userId;
      let refreshToken = req.body.refreshToken;

      let tokenApi = new TokenApi();
      await tokenApi.initialise();
      
      let refreshTokens = await tokenApi.findRefreshTokens(
      {
        userId: userId,
        refreshToken: refreshToken
      });

      let okay = false;
      let now = new Date();

      for (let t = 0; t < refreshTokens.length; t++) {
        let refreshToken = refreshTokens[t];
        if (refreshToken.expires < now) {
          await refreshToken.remove();
        } else {
          okay = true;
        }
      }

      if (okay)
      {
        let userApi = new UserApi();
        await userApi.initialise();
        
        let user = await userApi.findOne({_id: userId});

        delete user.password;

        let token = AuthRoutes._createToken(user, ["admin"]);
        res.cookie("access_token", token);
        res.status(200).send({user: user, accessToken: token});
      }
      else
        res.sendStatus(401);
    }
    catch(err)
    {
      Helpers.handleError(err, res);
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
        if (err) Helpers.handleError(err, res);
        else
        {
          let userApi = new UserApi();
          await userApi.initialise();
          
          let user = null;

          // Either get the user from mongo or create them if this is the first time we've seen them
          if (await userApi.userExists({email: aduser.mail}))
            user = await userApi.findOne({email: aduser.mail});
          else
          {
            let userModel =
            {
              isActiveDirectory: true,
              domain: domain,
              sid: sid,
              username: username,
              email: aduser.mail,
              firstName: aduser.givenName,
              lastName: aduser.sn,
              displayName: aduser.displayName,
              roles: groups || []
            };
            user = await userApi.createUser(userModel);
          }

          let token = AuthRoutes._createToken(user, groups);
          let refreshToken = randtoken.uid(256);

          let midnight = new Date();
          midnight.setDate(midnight.getDate() + 1);
          midnight.setHours(0,0,0,0);

          let refreshTokenDb =
          {
            userId: user._id,
            expires: midnight,
            refreshToken: refreshToken
          };

          let tokenApi = new TokenApi();
          await tokenApi.initialise();
          
          await tokenApi.createRefreshToken(refreshTokenDb);
          
          res.cookie("access_token", token);
          res.cookie("refresh_token", refreshToken);
          res.status(200).send({ user: user, accessToken: token, refreshToken: refreshToken });
      }});

    } catch(err){
        Helpers.handleError(err, res);
    }
  };
  
  static _forgotten = async (req, res) => {
    try
    {
      let email = req.body.email;
      
      let userApi = new UserApi();
      await userApi.initialise();
      
      let user = await userApi.findOne({ email: email });
      
      let tokenApi = new TokenApi();
      await tokenApi.initialise();
      
      let oneHour = new Date();
      oneHour.setHours(oneHour.getHours()+1);
  
      let resetTokenDb =
      {
        userId: user._id,
        expires: oneHour,
        resetToken: randtoken.uid(32)
      };
      
      await tokenApi.createResetPasswordToken(resetTokenDb);
      
      user.actions = [...user.actions, { action: userApi.actions.pwResetRequest }];
      
      let safeUser = Object.assign({}, user);
      delete safeUser.password;
      
      let emailApi = new EmailApi();
      await emailApi.sendResetPasswordEmail(safeUser);
      
      res.sendStatus(204);
    }
    catch(err)
    {
      Helpers.handleError(err, res);
    }
  };
  
  static _checkPasswordResetToken = async (req, res) => {
    try
    {
      let resetToken = req.body.resetToken;
      
      let tokenApi = new TokenApi();
      await tokenApi.initialise();
      
      let tokenRecord = await tokenApi.findOneResetPasswordToken({resetToken: resetToken});
      
      let userApi = new UserApi();
      await userApi.initialise();
      
      let userRecord = await userApi.findOne({_id: tokenRecord.userId});
  
      userRecord.password = await bcrypt.hash(req.body.password, 10);
      userRecord.actions = [...userRecord.actions, { action: userApi.actions.pwResetSuccess }];
      
      userRecord.save();
      
      res.sendStatus(204);
    }
    catch(err)
    {
      Helpers.handleError(err, res);
    }
  }
}
