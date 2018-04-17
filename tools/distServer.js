import express from "express";
import path from "path";
import open from "open";
import compression from "compression";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import colors from "colors";
import logger from "./logging";
import apiRoutes from "./apiRoutes";
import config from "../config";
import AuthRoutes from "../api/AuthRoutes";

const port = config.PORT;
const app = express();

logger.info("Starting production web server...");

app.use((req, res, next) => {
  req.logger = logger.child({
    method: req.method,
    ip: req.ip,
    xhr: req.xhr,
    url: req.originalUrl
  });
  next();
});

app.use(compression());
app.use(express.static("dist"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let opts = {};
opts.secretOrKey = AuthRoutes.SECRET;
opts.jwtFromRequest = (req) => {
  let token = null;
  if (req && req.cookies)
    token = req.cookies["access_token"];
  return token;
};

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
  let expirationDate = new Date(jwtPayload.exp * 1000);
  if (expirationDate < new Date()) {
    return done(null, false);
  }
  done(null, jwtPayload);
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.email);
});

logger.debug("Passport middleware registered");

app.use("/api", apiRoutes.hook(passport));

app.get("*", function(req, res) {
  res.sendFile(path.join( __dirname, "../dist/index.html"));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    let uri = `http://localhost:${port}`;
    open(uri);
    logger.info(`Production web server listening at ${uri}`);
  }
});
