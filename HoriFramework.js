const fs = require("fs")

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

  initialize(commandlineConfig){
    this.npmInfo = require("./package.json")
    this.processEnv = process.env
    this.libs.express = require('express');
    this.express = this.libs.express();

    this.binPath = process.execPath
    this.root = process.cwd()
    this.npmRoot = __dirname

    // load env
    this.env = commandlineConfig.env || this.processEnv["NODE_ENV"] || "development";

    // merge config
    this.config = require(`${this.root}/config/env/${this.env}`)

    // config the log
    const logConfiguration = this.config.logConfiguration
    this.libs.log4js = require("log4js");
    const logDir = logConfiguration.output || 'logs'
    const log4jsConfog = {
      appenders: {},
      categories: { default: { appenders: [this.env], level: logConfiguration.level || "debug" } }
    }
    const appender = { type: logConfiguration.type || "console" }
    if (["file","dateFile"].includes(appender.type) && logConfiguration.file){
      Object.assign(appender, logConfiguration.file)
      if (appender.filename){
        appender.filename = `${logDir}/${appender.filename}`
      }
    }
    log4jsConfog.appenders[this.env] = appender

    this.libs.log4js.configure(log4jsConfog);
    this.logger = this.libs.log4js.getLogger(this.env);

    this.config.port = commandlineConfig.port || 3000;

    this.application = require("./HoriApplication").create(this)
    this.application.initialize()
    return this
  }

  run(){
    // run custom code
    require(`${this.root}/config/initializer`)()

    // run app
    this.application.run()
  }

  debug(msg){
    if (Hori.env === "development"){
      console.log(msg)
    }
    this.logger.debug(msg)
  }

  static create(config){
    if (!HoriFramework.__instance__){
      HoriFramework.__instance__ = new HoriFramework(config)
      global.Hori = HoriFramework.__instance__
      global.HoriApplicationController = require("./HoriApplicationController")
    }
    return Hori
  }

  static run(commandlineConfig = {}){
    this.create().initialize(commandlineConfig).run()
  }
}
HoriFramework.__instance__ = null

module.exports = HoriFramework;
