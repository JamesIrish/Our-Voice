import fs from "fs";
import {Router} from "express";
import ConfigRoutes from "../api/ConfigRoutes";
import AuthRoutes from "../api/AuthRoutes";
import UserRoutes from "../api/UserRoutes";
import ProjectRoutes from "../api/ProjectRoutes";

/*
import winston from "winston";

const logDir = "logs";
if (!fs.existsSync(logDir))
  fs.mkdirSync(logDir);

const tsFormat = () => (new Date()).toLocaleTimeString();

let rotateFileTransport = new (require("winston-daily-rotate-file"))({
  filename: `${logDir}/%DATE%-app.log`,
  timestamp: tsFormat,
  datePattern: "YYYY-MM-DD",
  prepend: true,
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "debug"
});

const logger = new (winston.Logger)({
  transports: [
    rotateFileTransport,
    new (winston.transports.Console)({
      colorize: true,
      level: "info",
      prettyPrint: true,
      handleExceptions: true
    })
  ]
});

const hookLogger = (req, res, next) => {
  req.logger = logger;
  next();
};

*/

export default class ApiRoutes {
  
  static hook(passport) {
    
    //logger.debug("Our-Voice starting up...");

    /*  TODO
    Error toJSON hook/extension so that Node can return error's to the client - this
    should probably be handled more appropriately in case it leaks anything sensitive!
     */
    if (!("toJSON" in Error.prototype))
      Object.defineProperty(Error.prototype, "toJSON", {
        value: function () {
          let alt = {};

          Object.getOwnPropertyNames(this).forEach(function (key) {
            alt[key] = this[key];
          }, this);

          return alt;
        },
        configurable: true,
        writable: true
      });

    let routes = new Router();
    routes.use("/config", ConfigRoutes.routes());
    routes.use("/auth", AuthRoutes.routes());
    routes.use("/user", UserRoutes.routes());
    routes.use("/projects", passport.authenticate("jwt"), ProjectRoutes.routes());
    
    //logger.debug("All api routes registered.");
    
    return routes;
  }
}
