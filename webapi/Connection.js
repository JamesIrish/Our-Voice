import mongoose from "mongoose";
import config from "../config/index";
import logger from "../tools/logging";

let dbURI = config.mongoDb.url;

mongoose.connection.on("connected",() => {
  logger.info("Mongoose default connection open to " + dbURI);
});

mongoose.connection.on("error", (err) => {
  logger.warn("Mongoose default connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("Mongoose default connection disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    logger.info("Mongoose default connection disconnected");
  });
});

export default mongoose.connect(dbURI, config.mongoDb.settings);
