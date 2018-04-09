import express from "express";
import path from "path";
import open from "open";
import compression from "compression";
import bodyParser from "body-parser";
import passport from "passport";
import apiRoutes from "./apiRoutes";
import config from "../config";

const port = config.PORT;
const app = express();

app.use(compression());
app.use(express.static("dist"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.email);
});

app.use("/api", apiRoutes.hook());

app.get("*", function(req, res) {
  res.sendFile(path.join( __dirname, "../dist/index.html"));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});
