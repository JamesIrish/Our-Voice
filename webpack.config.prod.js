import webpack from "webpack";
import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";

export default {
  devtool: "source-map",
  entry: path.resolve(__dirname, "src/index"),
  target: "web",
  output: {
    path: __dirname + "/dist", // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist")
  },
  plugins: [
    new webpack.DefinePlugin({ "process.env": { "NODE_ENV": "production" }}),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ExtractTextPlugin("styles.css"),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new BundleAnalyzerPlugin()
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname, "src"), loaders: ["babel-loader"]},
      {test: /(\.css)$/, loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
      {test: /\.(woff|woff2)$/, loader: "url?prefix=font/&limit=5000"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"}
    ]
  }
};
