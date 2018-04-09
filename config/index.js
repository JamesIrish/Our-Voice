import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import nconf from "nconf";

const NODE_ENV = process.env.NODE_ENV;

process.env["mondoDb_url"] = "mongooose";

nconf
  .argv()
  .env(
  {
    separator: "_",
    parseValues: true
  })
  .file(
  {
    file: path.resolve(__dirname, `${NODE_ENV}.yml`),
    format: require("nconf-yaml")
  })
  .defaults(yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "default.yml"), "utf-8")));

/*


let processEnvAppKeys = filter(keys(process.env), (key) => key.substr(0, 3) === "app");
console.log("Env 'app' keys: ", processEnvAppKeys);

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
*/

let config = nconf.get();

const indentedJson = JSON.stringify(config, null, 2);
console.log("Using config: ", indentedJson);

export default config;
