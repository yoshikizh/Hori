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
      process.exit()
    }
  }

  processHelp(){
    if (["-h", "help", "--help"].includes(this.command)){
      const list = [
        {k: "-v,version,--version", v: "Printer current version."},
        {k: "-h,help,--help", v: "Printer the command list."},
        {k: "new <name>", v: "Create a new basic Hori application structure."},
        {k: "s,start", v: "To start a Hori application process."},
        {k: "-p <port>", v: "Set a port to start, default is 3000."},
        {k: "-e <env>", v: "Set a env to start, default is development."}
      ]
      list.forEach((obj) => {
        process.stdout.write(this._formatString(chalk.green(obj.k), 40))
        console.log(obj.v)
      })
      process.exit()
    }
  }

  processNew(){
    const appName = this.fetchArgv("new")
    if (!appName) return


    process.exit()
  }

  processStart(){
    if (["s", "start"].includes(this.command)){
      require("../HoriFramework").run()
    }
  }

  parseCommandLine(){
    this.processVersion()
    this.processHelp()
    this.processNew()
    this.processStart()
  }

  // private
  _formatString(str, bit){
    const spaceLength = bit - str.length
    let output = ""
    for (let i = 0; i < spaceLength; i++){
      output = `${output} `
    }
    output = ` ${str}${output}`
    return output
  }

  static run(){
    const horiBin = new HoriBin()
    horiBin.parseCommandLine()
  }
}

HoriBin.run()


