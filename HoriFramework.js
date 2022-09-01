class HoriFramework {
  constructor(){
    this.libs = {}
    this.npmInfo = null
    this.binPath = null;
    this.root = null;
    this.npmRoot = null;
    this.express = null;
    this.logger = null;
    this.nodeEnv = null;
    this.processEnv = null;
    this.env = null;
    this.config = null;
    this.application = null
  }

  initialize(){
    this.npmInfo = require("./package.json")
    this.processEnv = process.env
    this.libs.express = require('express');
    this.express = this.libs.express();

    this.binPath = process.execPath
    this.root = process.cwd()
    this.npmRoot = __dirname

    // load env
    this.env = this.processEnv["NODE_ENV"] || "development";

    // merge config
    this.config = require(`${this.root}/config/env/${this.env}`)

    // config the log
    this.libs.log4js = require("log4js");
    const logDir = this.config.logDir || 'logs'
    const log4jsConfog = {
      appenders: {},
      categories: { default: { appenders: [this.env], level: "debug" } }
    }
    log4jsConfog.appenders[this.env] = { type: "file", filename: `${logDir}/${this.env}.log` }

    this.libs.log4js.configure(log4jsConfog);
    this.logger = this.libs.log4js.getLogger(this.env);

    this.config.port = this.config.port || 3001;

    this.application = require("./HoriApplication").create(this)
    this.application.initialize()
    return this
  }

  run(){
    this.application.run()
  }

  debug(msg){
    if (Hori.env === "development"){
      console.log(msg)
    }
    this.logger.debug(msg)
  }

  static create(){
    if (!HoriFramework.__instance__){
      HoriFramework.__instance__ = new HoriFramework()
      global.Hori = HoriFramework.__instance__
      global.HoriApplicationController = require("./HoriApplicationController")
    }
    return Hori
  }

  static run(config = {}){
    this.create().initialize().run()
  }
}
HoriFramework.__instance__ = null

module.exports = HoriFramework;
