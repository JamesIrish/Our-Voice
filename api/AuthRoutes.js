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
import assert from "assert-plus";

export default class AuthRoutes {

  static SECRET = "VOICE_SECRET";

  static routes = () => {
    let routes = new Router();
  
    routes.post("/login", AuthRoutes._login);
    routes.post("/refresh", AuthRoutes._refresh);
    routes.post("/forgotten", AuthRoutes._forgotten);
    routes.post("/checkPasswordResetToken", AuthRoutes._checkPasswordResetToken);
    routes.post("/resetPassword", AuthRoutes._resetPassword);
    
    if (os.platform() === "win32") {
      routes.post("/sspi", function (req, res, next) {
        let NodeSSPI = require("node-sspi");
        let nodeSSPIObj = new NodeSSPI({
          retrieveGroups: true,
          offerBasic: false
        });
        nodeSSPIObj.authenticate(req, res, function (err) {
          if (err) Helpers.handleError(err, req, res);
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
      assert.string(email, "email");
      let password = req.body.password;
      assert.string(password, "password");

      let userApi = new UserApi();
      await userApi.initialise();
      
      let user = await userApi.findOne({email: email});
      assert.object(user, "user account not found");

      let userObj = user.toObject();
      delete userObj.actions;
      req.log.debug(userObj, `Lookup of email ${email} result`);
      
      let match = await bcrypt.compare(password, user.password);

      if (match)
      {
        req.log.info(`User ${email} authenticated.`);
        
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
        
        req.log.debug(`Refresh token stored in db for user ${email}`);
        
        res.cookie("access_token", token);
        res.cookie("refresh_token", refreshToken);
        res.status(200).send({user: user, accessToken: token, refreshToken: refreshToken});
        
        req.log.debug(`Token issued and cookies set for login request for ${email}`);
      }
      else
      {
        req.log.warn(`User ${email} login failed. Passwords DO NOT match.`);
        
        user.actions = [...user.actions, {action: userApi.actions.loginFailure}];
        await user.save();
        
        res.sendStatus(401);
      }
    }
    catch(err)
    {
      Helpers.handleError(err, req, res);
    }
  };

  static _refresh = async (req, res) => {
    try
    {
      let userApi = new UserApi();
      await userApi.initialise();
      
      let userId = req.body.userId;
      assert.string(userId, "userId");
      let refreshToken = req.body.refreshToken;
      assert.string(refreshToken, "refreshToken");

      let tokenApi = new TokenApi();
      await tokenApi.initialise();
      
      let refreshTokens = await tokenApi.findRefreshTokens(
      {
        userId: userId
      });
      
      req.log.debug(`${refreshTokens.length} refresh token found for ${userId}`);

      let okay = false;
      let now = new Date();

      for (let t = 0; t < refreshTokens.length; t++) {
        let refreshToken = refreshTokens[t];
        if (refreshToken.expires < now) {
          await refreshToken.remove();
          req.log.debug(`Expired refresh token removed for ${userId}`);
        } else {
          okay = true;
        }
      }

      if (okay)
      {
        let userApi = new UserApi();
        await userApi.initialise();
        
        let user = await userApi.findOne({_id: userId});
  
        assert.object(user, `User for ${userId}`);
        
        delete user.password;
        
        req.log.debug(user, "Loaded user record from db");
        
        let token = AuthRoutes._createToken(user, ["admin"]);
        res.cookie("access_token", token);
        res.status(200).send({user: user, accessToken: token});
        
        req.log.debug(`Access token (re)issued for user ${user.email}`);
      }
      else
      {
        req.log.debug(`Unable to locate valid refresh token for user ${userId}, returning 401.`);
        res.sendStatus(401);
      }
    }
    catch(err)
    {
      Helpers.handleError(err, req, res);
    }
  };

  static _sspi = async (req, res) => {
    try
    {
      // Tidy inputs
      let usernameWithDomain = req.connection.user;
      assert.string(usernameWithDomain, "connection.user - e.g. SSPI middleware fail");
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

      req.log.info(`User ${domain}\\${username} authenticated`);

      // Query AD for user's names & email address  MUST BE CALLBACK
      let ad = new ActiveDirectory(config.activeDirectory.config);
      ad.findUser(username, async (err, aduser) =>
      {
        if (err) Helpers.handleError(err, req, res);
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
          
          req.log.debug(`Refresh token created for user ${user.email}`);
          
          res.cookie("access_token", token);
          res.cookie("refresh_token", refreshToken);
          res.status(200).send({ user: user, accessToken: token, refreshToken: refreshToken });
      }});
    }
    catch(err)
    {
        Helpers.handleError(err, req, res);
    }
  };
  
  static _forgotten = async (req, res) => {
    try
    {
      let email = req.body.email;
      assert.string(email, "email");
      
      let userApi = new UserApi();
      await userApi.initialise();
      
      let user = await userApi.findOne({ email: email });
      if (user)
      {
        req.log.debug(`User ${user.email} loaded from database`);
  
        let tokenApi = new TokenApi();
        await tokenApi.initialise();
  
        let oneHour = new Date();
        oneHour.setHours(oneHour.getHours() + 1);
  
        let resetTokenDb =
          {
            userId: user._id,
            expires: oneHour,
            resetToken: randtoken.uid(32)
          };
  
        await tokenApi.createResetPasswordToken(resetTokenDb);
  
        req.log.debug(`Password reset token created and saved into database for ${user.email}`);
  
        user.actions = [...user.actions, {action: userApi.actions.pwResetRequest}];
  
        user.save();
  
        let safeUser = user.toObject();
        delete safeUser.password;
  
        let emailApi = new EmailApi();
        await emailApi.sendResetPasswordEmail(safeUser, resetTokenDb.resetToken);
  
        req.log.info(`Password reset email generated & sent to ${user.email}`);
      } else
        req.log.info(`No user account found for ${email}`);
      
      res.sendStatus(204);
    }
    catch(err)
    {
      Helpers.handleError(err, req, res);
    }
  };
  
  static _checkPasswordResetToken = async (req, res) => {
    try
    {
      let passwordResetToken = req.body.passwordResetToken;
      assert.string(passwordResetToken, "passwordResetToken");
      
      let tokenApi = new TokenApi();
      await tokenApi.initialise();
      
      let tokenRecord = await tokenApi.findOneResetPasswordToken({resetToken: passwordResetToken});
      if (tokenRecord)
      {
        req.log.debug({ token: tokenRecord.toObject() }, "Token loaded from database");
        
        let expired = tokenRecord.expires.getTime() < new Date().getTime();
        if (expired)
        {
          req.log.warn(`Token ${passwordResetToken} has expired`);
          res.send({ okay: false, reason: "token expired" });
        }
        else
        {
          req.log.info(`Token ${passwordResetToken} valid`);
          res.send(Object.assign({ okay: true }, tokenRecord.toObject()));
        }
      }
      else
      {
        req.log.warn(`Token ${passwordResetToken} could not be found`);
        res.send({ okay: false, reason: "token removed" });
      }
    }
    catch(err)
    {
      Helpers.handleError(err, req, res);
    }
  };
  
  static _resetPassword = async (req, res) => {
    try
    {
      let passwordResetToken = req.body.passwordResetToken;
      assert.string(passwordResetToken, "passwordResetToken");
      
      let newPassword = req.body.newPassword;
      assert.string(newPassword, "newPassword");
  
      let tokenApi = new TokenApi();
      await tokenApi.initialise();
  
      let tokenRecord = await tokenApi.findOneResetPasswordToken({resetToken: passwordResetToken});
      if (tokenRecord)
      {
        let expired = tokenRecord.expires.getTime() < new Date().getTime();
        if (expired)
        {
          req.log.warn(`Token ${passwordResetToken} has expired`);
          tokenRecord.remove();
          res.status(401).send("Token expired");
        }
        else
        {
          req.log.debug({token: tokenRecord.toObject()}, "Token loaded from database");
  
          let userApi = new UserApi();
          await userApi.initialise();
  
          let user = await userApi.findOne({_id: tokenRecord.userId});
          if (user)
          {
            let safeUser = user.toObject();
            delete safeUser.password;
            req.log.debug({user: safeUser}, "User loaded from database");
  
            user.password = await bcrypt.hash(newPassword, 10);
            user.actions = [...user.actions, {action: userApi.actions.pwResetSuccess}];
  
            user.save();
  
            tokenRecord.remove();
  
            req.log.info(`Password reset successful for ${user.email}`);
  
            res.send("Password reset successful");
          }
          else
          {
            req.log.error(`Unable to find user ${tokenRecord.userId}`);
            res.status(500).send("Unable to find user record for this password reset token");
          }
        }
      }
      else
      {
        res.status(401).send("Unable to find password reset token");
      }
    }
    catch (err)
    {
      Helpers.handleError(err, req, res);
    }
  }
}
