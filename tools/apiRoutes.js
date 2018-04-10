import {Router} from "express";
import DatabaseClient from "../api/DatabaseClient";
import ConfigApi from "../api/ConfigApi";
import AuthApi from "../api/AuthApi";
import UserApi from "../api/UserApi";
import ProjectApi from "../api/ProjectApi";

export default class ApiRoutes {
  static hook(passport) {
    
    /*  TODO
    Error toJSON hook/extension so that Node can return error's to the client - this
    should probably be handled more appropriately in case it leaks!
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
    
    let client = new DatabaseClient();
    client.createIndexes();
    
    let routes = new Router();
    routes.use("/config", ConfigApi.routes());
    routes.use("/auth", AuthApi.routes());
    routes.use("/user", UserApi.routes());
    routes.use("/projects", passport.authenticate("jwt"), ProjectApi.routes());
    return routes;
  }
}
