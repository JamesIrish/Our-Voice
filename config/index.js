import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import defaultsDeep from "lodash.defaultsdeep";

const NODE_ENV = process.env.NODE_ENV;
let baseConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "default.yml"), "utf-8"));
let envConfig = null;

switch (NODE_ENV) {
  case "production":
    envConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "production.yml"), "utf-8"));
    break;
  case "staging":
    envConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "staging.yml"), "utf-8"));
    break;
  default:
    envConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "development.yml"), "utf-8"));
}

let config = defaultsDeep({}, process.env, { app: envConfig }, { app: baseConfig });

const indentedJson = JSON.stringify(config, null, 2);
console.log("Using app config: ", indentedJson);

export default config;
