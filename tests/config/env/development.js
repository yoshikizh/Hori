module.exports = {
  // For Hori
  appName: "Hori Api",

  // For log config
  logConfiguration: {

    // output folder
    output: "./logs",

    // console | file
    type: "file",  

    // output lowest level
    level: "debug",    

    // blow if avaliable if type is file or dataFile
    file: {
      filename: "development.log",
      compress: true,
      maxLogSize: 10240000,
      backups: 3,

      // if set to true, will enable the pattern suffix
      alwaysIncludePattern: true,
      pattern: "yyyy-MM-dd"
    }
  }

  // For Application
  // Hori.config can get this file object directly.

}