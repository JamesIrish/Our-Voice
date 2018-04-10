import {Router} from "express";
import config from "../config";

export default class ConfigApi {
  
  static routes = () => {
    let routes = new Router();
    
    routes.get("/", (req, res) => {
      res.send(
      {
        activeDirectory: config.activeDirectory
      });
    });
    
    return routes;
  };
}
