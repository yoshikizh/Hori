class Hori {
  constructor(){
    this.libs = {}
    this.binPath = null;
    this.root = null;
    this.npmRoot = null;
    this.app = null;
    this.logger = null;
  }

  initialize(){
    this.libs.express = require('express');
    this.app = this.libs.express();

    this.binPath = process.execPath
    this.root = process.cwd()
    this.npmRoot = __dirname

    this.libs.log4js = require("log4js");
    this.libs.log4js.configure({
      appenders: { development: { type: "file", filename: "logs/development.log" } },
      categories: { default: { appenders: ["development"], level: "debug" } },
    });
    this.logger = this.libs.log4js.getLogger("development");

    this.setMiddleware()
  }

  setMiddleware(){
    this.app.use(this.libs.log4js.connectLogger(this.libs.log4js.getLogger("http"), { level: 'auto' }));
  }

  run(){
    this.app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    this.logger.info("Hori web server (v0.0.1)")
    this.logger.info("Listening on localhost:3000, CTRL+C to stop")
    this.app.listen(3000, "0.0.0.0");
  }
}

module.exports = new Hori();
