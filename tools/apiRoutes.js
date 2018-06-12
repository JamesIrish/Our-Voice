import {Router} from "express";
import Connection from "../webapi/Connection";
import ConfigRoutes from "../webapi/ConfigRoutes";
import AuthRoutes from "../webapi/AuthRoutes";
import UserRoutes from "../webapi/UserRoutes";
import ProjectRoutes from "../webapi/ProjectRoutes";

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
    routes.use("/auth", AuthRoutes.routes(passport));
    routes.use("/user", UserRoutes.routes(passport));
    routes.use("/projects", passport.authenticate("jwt"), ProjectRoutes.routes());

    return routes;
  }
}
