const fs = require("fs")
const chalk = require("chalk")

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
    this.commandlineConfig = null
  }

  initialize(commandlineConfig){
    this.commandlineConfig = commandlineConfig
    this.npmInfo = require("../package.json")
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

    if (this.config.database.enable){
      require("./orm")(this.config.database.adapter)
      this.autoloadModels(`${this.root}/app/models`)
    }

    this.application = require("./HoriApplication").create(this)
    this.application.initialize()
    return this
  }

  // clearRequireCache(){
  //   // delete require.cache[require.resolve(`${this.root}/config/env/${this.env}`)]
  //   // delete require.cache[require.resolve(`${this.root}/config/initializer`)]
  //   // delete require.cache[require.resolve(`${this.root}/config/middlewares`)]
  //   // delete require.cache[require.resolve(`${this.root}/config/routes`)]

  //   this.autoClearRequireCaches(`${this.root}/config`)
  //   this.autoClearRequireCaches(`${this.root}/app/models`)
  //   this.autoClearRequireCaches(`${this.root}/app/controllers`)
  // }

  // restart(){
  //   // this.restarted = true
  //   // this.clearRequireCache()
  //   // HoriRecord.disconnect()
  //   // HoriFramework.run(this.commandlineConfig)
  //   // this.application.server.close()
  // }

  // monitorExitSignal(){
  //   process.on('SIGTERM', () => {
  //     console.log('Receiving SIGTERM signal in nodeJS.'); 
  //     setTimeout(() => {

  //       HoriFramework.run(this.commandlineConfig)
  //     },500)
  //   }); 
  // }

  run(){
    // run custom code
    require(`${this.root}/config/initializer`)()

    // run app
    this.application.run()
    
    // after run handle
    this.handleAfterRun()
  }

  handleAfterRun(){
    // this.monitorFilesChange()
  }

  // stopMonitorFilesChange(){
  //   this.appFiles.forEach((file) => {
  //     fs.unwatchFile(file)
  //   })
  // }

  // monitorFilesChange(){
  //   require('events').EventEmitter.defaultMaxListeners = 10000;
  //   this.searchAppFilesFromDir(`${this.root}/app`)
  //   this.searchAppFilesFromDir(`${this.root}/config`)
  //   this.appFiles.forEach((file) => {
  //     fs.watchFile(file, {interval: this.config.autoRestartMonitorInterval}, (curr, prev) => {
  //       Hori.logger.info(chalk.green(file + " was changed!"))
  //       this.stopMonitorFilesChange()
  //       this.restart()
  //     });
  //   })
  // }

  // autoClearRequireCaches(dir){
  //   const files = fs.readdirSync(dir)
  //   files.forEach((filename) => {
  //     const fileToPath = dir + "/" + filename
  //     const state = fs.statSync(fileToPath)
  //     if (state.isFile()){
  //       delete require.cache[require.resolve(fileToPath)]
  //     } else {
  //       this.autoClearRequireCaches(fileToPath)
  //     }
  //   })
  // }

  autoloadModels(dir){
    const files = fs.readdirSync(dir)
    files.forEach((filename) => {
      const fileToPath = dir + "/" + filename
      const state = fs.statSync(fileToPath)
      if (state.isFile()){
        const model = require(fileToPath)
        global[model.name.toString()] = model
      } else {
        this.autoloadModels(fileToPath)
      }
    })
  }

  // searchAppFilesFromDir(dir){
  //   const files = fs.readdirSync(dir)
  //   files.forEach((filename) => {
  //     const fileToPath = dir + "/" + filename
  //     const state = fs.statSync(fileToPath)
  //     if (state.isFile()){
  //       this.appFiles.push(fileToPath)
  //     } else {
  //       this.searchAppFilesFromDir(fileToPath)
  //     }
  //   })
  // }

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
