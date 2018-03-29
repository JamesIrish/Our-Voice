import fs from "fs";

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

fs.createReadStream('node_modules/jquery/dist/jquery.min.js').pipe(fs.createWriteStream('dist/js/jquery.min.js'));
fs.createReadStream('src/styles/styles.css').pipe(fs.createWriteStream('dist/css/styles.css'));
