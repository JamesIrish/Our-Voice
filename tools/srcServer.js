import express from 'express';
import webpack from 'webpack';
import path from 'path';
import webpackconfig from '../webpack.config.dev';
import open from 'open';
import config from '../config/index';

/* eslint-disable no-console */

const port = config.server.port;
const app = express();
const compiler = webpack(webpackconfig);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackconfig.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static("dist"));

app.get('/', function(req, res) {
  res.sendFile(path.join( __dirname, '../src/index.html'));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});
