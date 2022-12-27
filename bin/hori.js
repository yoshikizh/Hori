#!/usr/bin/env node
const chalk = require("chalk")

class HoriBin {

  constructor(){
    this.package = require("../package")
    this.argv = process.argv
    this.command = this.argv[2]
  }

  fetchArgv(key){
    if (this.command === key){
      const commandIndex = this.argv.indexOf(key)
      const value = this.argv[commandIndex + 1]
      return value
    }
  }

  processVersion(){
    if (["-v", "version", "--version"].includes(this.command)){
      const name = this.package.name
      const version = this.package.version
      console.log(chalk.green(`${name} application ${version}`))
    }
  }

  formatString(str, bit){
    const spaceLength = bit - str.length
    let output = ""
    for (let i = 0; i < spaceLength; i++){
      output = `${output} `
    }
    output = ` ${str}${output}`
    return output
  }

  processHelp(){
    if (["-h", "help", "--help"].includes(this.command)){
      const list = [
        {k: "-v,version,--version", v: "Printer current version."},
        {k: "-h,help,--help", v: "Printer the command list."},
        {k: "new <name>", v: "Create a new basic Hori application structure."},
        {k: "-s,start", v: "To start a Hori application process."},
        {k: "-p <port>", v: "Set a port to start, default is 3000."},
        {k: "-e <env>", v: "Set a env to start, default is development."}
      ]
      list.forEach((obj) => {
        process.stdout.write(this.formatString(chalk.green(obj.k), 40))
        console.log(obj.v)
      })
    }
  }

  processInitialize(){
    const appName = this.fetchArgv("new")
    if (!appName) return

  }

  parseCommandLine(){

    this.processVersion()
    this.processHelp()
    this.processInitialize()

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


