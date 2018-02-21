import fs from "fs";
import colors from "colors";

/*eslint-disable no-console*/

fs.readFile("src/index.html", "utf8", (err, markup) => {
  if (err) {
    return console.log(err);
  }

  fs.writeFile("dist/index.html", markup, "utf8", function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("index.html written to /dist".green);
  });
});
