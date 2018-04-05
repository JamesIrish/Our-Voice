import {Router} from 'express';
import UserApi from "../api/UserApi";

export default class ApiRoutes {
  static hook() {
    let routes = new Router();
    routes.use('/user', UserApi.routes());
    return routes;
  }
}
