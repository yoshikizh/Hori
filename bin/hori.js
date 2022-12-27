#!/usr/bin/env node
const chalk = require("chalk")
const fs = require("fs")

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

  fetchOption(key){
    const optionIndex = this.argv.indexOf(key)
    if (optionIndex < 0) return null
    const value = this.argv[optionIndex + 1]
    return value
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

    const root = process.cwd()
    const appPath = `${root}/${appName}`
    if (fs.existsSync(appPath)){
      console.log(`${appPath} existed.`)
      return
    }
    fs.mkdirSync(appPath)
    console.log(chalk.green(`Created folder ${appPath}`))

    fs.mkdirSync(`${appPath}/app`)
    console.log(chalk.green(`Created folder app`))

    fs.mkdirSync(`${appPath}/app/controllers`)
    console.log(chalk.green(`Created folder app/controllers`))

    fs.mkdirSync(`${appPath}/config`)
    console.log(chalk.green(`Created folder config`))

    fs.mkdirSync(`${appPath}/config/env`)
    console.log(chalk.green(`Created folder config/env`))

    let data
    data = fs.readFileSync("./scaffold/new/config/initializer.js")
    fs.writeFileSync(`${appPath}/config/initializer.js`, data)
    console.log(chalk.green(`Created file config/initializer.js`))

    data = fs.readFileSync("./scaffold/new/config/middlewares.js")
    fs.writeFileSync(`${appPath}/config/middlewares.js`, data)
    console.log(chalk.green(`Created file config/middlewares.js`))

    data = fs.readFileSync("./scaffold/new/config/routes.js")
    fs.writeFileSync(`${appPath}/config/routes.js`, data)
    console.log(chalk.green(`Created file config/routes.js`))

    data = fs.readFileSync("./scaffold/new/config/env/env.js")
    fs.writeFileSync(`${appPath}/config/env/development.js`, data)
    console.log(chalk.green(`Created file config/env/development.js`))

    data = fs.readFileSync("./scaffold/new/app/controllers/ApplicationController.js")
    fs.writeFileSync(`${appPath}/app/controllers/ApplicationController.js`, data)
    console.log(chalk.green(`Created file app/controllers/ApplicationController.js`))

    data = fs.readFileSync("./scaffold/new/app/controllers/HomeApplication.js")
    fs.writeFileSync(`${appPath}/app/controllers/HomeApplication.js`, data)
    console.log(chalk.green(`Created file app/controllers/HomeApplication.js`))

    process.exit()
  }

  processStart(){
    if (["s", "start"].includes(this.command)){
      const port = this.fetchOption("-p") || null
      const env = this.fetchOption("-e") || null
      require("../HoriFramework").run({port, env})
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


