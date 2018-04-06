import {Router} from "express";
import DatabaseClient from "../api/DatabaseClient";
import AuthApi from "../api/AuthApi";
import UserApi from "../api/UserApi";
import ProjectApi from "../api/ProjectApi";

export default class ApiRoutes {
  static hook(passport) {
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
    
    let client = new DatabaseClient();
    client.createIndexes();
    
    let routes = new Router();
    routes.use("/auth", AuthApi.routes());
    routes.use("/user", UserApi.routes());
    routes.use("/projects", passport.authenticate("jwt"), ProjectApi.routes());
    return routes;
  }
}
