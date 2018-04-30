import express from "express";
import webpack from "webpack";
import path from "path";
import webpackconfig from "../webpack.config.dev";
import cookieParser from "cookie-parser";
import open from "open";
import bodyParser from "body-parser";
import config from "../config/index";
import passport from "passport";
import colors from "colors";
import { Strategy as JwtStrategy } from "passport-jwt";
import logger from "./logging";
import AuthRoutes from "../webapi/AuthRoutes";
import apiRoutes from "./apiRoutes";
import bunyanMiddleware from "bunyan-middleware";

const port = config.PORT;
const app = express();
const compiler = webpack(webpackconfig);

logger.info("Starting development web server...");

app.use(bunyanMiddleware({
  headerName: "X-Request-Id",
  propertyName: "reqId",
  logName: "req_id",
  obscureHeaders: [],
  logger: logger,
  additionalRequestFinishData: function(req, res) {
      return {};
    }
  }
));

app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: true,
  publicPath: webpackconfig.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));
logger.debug("HMRE middleware registered.");

app.use(express.static("dist"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let opts = {};
opts.secretOrKey = AuthRoutes.SECRET;
opts.jwtFromRequest = (req) => {
  logger.debug("Looking for cookie...");
  let token = null;
  if (req && req.cookies)
    token = req.cookies["access_token"];
  return token;
};

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
  logger.debug("Verifying JWT..");
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
  res.sendFile(path.join( __dirname, "../src/index.html"));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    let uri = `http://localhost:${port}`;
    open(uri);
    logger.info(`Development web server listening at ${uri}`);
  }
});
