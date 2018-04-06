import {Router} from 'express';
import AuthApi from "../api/AuthApi";
import UserApi from "../api/UserApi";

export default class ApiRoutes {
  static hook() {
    let routes = new Router();
    routes.use('/auth', AuthApi.routes());
    routes.use('/user', UserApi.routes());
    return routes;
  }
}
