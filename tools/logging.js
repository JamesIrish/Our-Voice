import bunyan from "bunyan";
import path from "path";
import bunyanDebugStream from "bunyan-debug-stream";
import fse from "fs-extra";

const logpath = path.join(__dirname, "../logs/app.log");
fse.outputFileSync(logpath, "");

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
    path: logpath,
    period: "1d",
    count: 14
  }]
});

export default log;
