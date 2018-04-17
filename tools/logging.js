import bunyan from "bunyan";
import path from "path";
import bunyanDebugStream from "bunyan-debug-stream";

const log = bunyan.createLogger({
  name: "our-voice",
  streams: [{
    type: "raw",
    level: "debug",
    stream: bunyanDebugStream({
      basepath: __dirname,
      forceColor: true
    })
  },{
    level: "debug",
    type: "rotating-file",
    path: path.join(__dirname, "../logs/app.log"),
    period: "1d",
    count: 14
  }]
});

export default log;
