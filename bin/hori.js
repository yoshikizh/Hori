#!/usr/bin/env node
const chalk = require("chalk")

class HoriBin {

  constructor(){
    this.package = require("../package")
    this.argv = process.argv
    this.command = this.argv[2]
  }

  fetchArgv(key){

  }

  processVersion(){
    if (["-v", "version", "--version"].includes(this.command)){
      const name = this.package.name
      const version = this.package.version
      console.log(chalk.green(`${name} application ${version}`))
    }
  }

  parseCommandLine(){

    this.processVersion()

    // const argv = process.argv
    // const command = argv[1]
    // const root  = process.cwd()

    
    // if (["-v", "version", "--version"].includes(command)){

    //   let commandIndex
    //   commandIndex = argv.indexOf("-v")
    //   if (commandIndex < 0) commandIndex = argv.indexOf("version")
    //   if (commandIndex < 0) commandIndex = argv.indexOf("--version")

      

    //   process.exit()
    // }
  }

  static run(){
    const horiBin = new HoriBin()
    horiBin.parseCommandLine()
  }
}

HoriBin.run()


