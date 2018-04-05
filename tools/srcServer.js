import express from 'express';
import webpack from 'webpack';
import path from 'path';
import webpackconfig from '../webpack.config.dev';
import open from 'open';
import bodyParser from "body-parser";
import config from '../config/index';
import apiRoutes from "./apiRoutes";

const port = config.server.port;
const app = express();
const compiler = webpack(webpackconfig);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackconfig.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static("dist"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRoutes.hook());

app.get('*', function(req, res) {
  res.sendFile(path.join( __dirname, '../src/index.html'));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});
