import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const NODE_ENV = process.env.NODE_ENV;
let config = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "default.yml"), "utf-8"));

switch (NODE_ENV) {
  case "production":
    config = Object.assign({}, config, yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "production.yml"), "utf-8")));
    break;
  case "staging":
    config = Object.assign({}, config, yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "staging.yml"), "utf-8")));
    break;
  default:
    config = Object.assign({}, config, yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "development.yml"), "utf-8")));
}

const indentedJson = JSON.stringify(config, null, 2);
console.log("Using config: ", indentedJson);

export default config;
