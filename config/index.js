import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import nconf from "nconf";

const NODE_ENV = process.env.NODE_ENV || "development";

nconf
  .argv()
  .env(
  {
    match: /(mongoDb|smtp|activeDirectory)/gmi,
    whitelist: ["PORT"],
    separator: "_",
    parseValues: true
  })
  .file(
  {
    file: path.resolve(__dirname, `${NODE_ENV}.yml`),
    format: require("nconf-yaml")
  })
  .defaults(yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "default.yml"), "utf-8")));

let config = nconf.get();

const indentedJson = JSON.stringify(config, null, 2);
console.log("Using config: ", indentedJson);

export default config;
