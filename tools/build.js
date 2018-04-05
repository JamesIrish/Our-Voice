/*eslint-disable no-console*/
import webpack from "webpack";
import webpackConfig from "../webpack.config.prod";
import colors from "colors";

process.env.NODE_ENV = "production";

console.log("Generating minified bundle for production via Webpack. This will take a moment".blue);

webpack(webpackConfig).run((err, stats) => {
  if (err) {
    console.log(err.bold.red);
    return 1;
  }

  const jsonStats = stats.toJson();

  if (jsonStats.errors.length > 0) {
    return jsonStats.errors.map(error => console.log(error.red));
  }

  if (jsonStats.warnings.length > 0) {
    jsonStats.warnings.map(warning => console.log(warning.yellow));
  }
  
  console.log("Your app has been compiled in production mode and written to /dist.  It's ready to roll!".green);

  return 0;
});
