module.exports = {
  // For Hori
  appName: "Your application name",

  // For log config
  logConfiguration: {

    // output folder
    output: "./logs",

    // console | file
    type: "console",

    // output lowest level
    level: "debug",

    // blow is avaliable if type is file
    file: {
      filename: "development.log",
      compress: true,
      maxLogSize: 10240000,
      backups: 3,

      // if set to true, will enable the pattern suffix
      alwaysIncludePattern: true,
      pattern: "yyyy-MM-dd"
    }
  },

  // For db connection info
  database: {

    // If you want to use model HoriRecord(ORM), enable the configuration.
    // Currently only support mongodb
    // Install mongodb and add mongoose to your package.json
    enable: true,
    adapter: "mongodb",
    mongodb: {
      host: "localhost:27017",

      // More connection option refre -> https://mongoosejs.com/docs/connections.html
      // [!Notice] Different versions of mongoose have different configurations
      option: {
        user: "username",
        pass: "password",
        dbName: "dbname",
      }
    }
  }


  // For Application
  // Hori.config can get this file object directly.
}