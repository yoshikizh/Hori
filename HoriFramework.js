class HoriFramework {
  constructor(){
    this.libs = {}
    this.binPath = null;
    this.root = null;
    this.npmRoot = null;
    this.express = null;
    this.logger = null;
    this.nodeEnv = null;
    this.processEnv = null;
    this.env = null;
    this.config = {};
    this.application = null
  }

  initialize(){
    this.processEnv = process.env
    this.libs.express = require('express');
    this.express = this.libs.express();

    this.binPath = process.execPath
    this.root = process.cwd()
    this.npmRoot = __dirname

    this.libs.log4js = require("log4js");
    this.libs.log4js.configure({
      appenders: { development: { type: "file", filename: "logs/development.log" } },
      categories: { default: { appenders: ["development"], level: "debug" } },
    });
    this.logger = this.libs.log4js.getLogger("development");

    this.env = this.processEnv["NODE_ENV"] || "development";
    this.config.port = this.processEnv["port"] || 3000;

    // this.setMiddleware()

    this.application = require("./HoriApplication").create(this)
    this.application.initialize()
    return this
  }

  run(){
    this.application.run()
  }

  static create(){
    if (!HoriFramework.__instance__){
      HoriFramework.__instance__ = new HoriFramework()
      global.Hori = HoriFramework.__instance__
    }
    return Hori
  }

  static run(config = {}){
    this.create().initialize().run()
  }
}
HoriFramework.__instance__ = null

module.exports = HoriFramework;
