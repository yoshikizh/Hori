module.exports = {
  // For Hori
  appName: "Hori Api",

  // speed up for development
  // Files under the app and config folders will be monitor.
  autoRestartWhenFileChanged: true,
  autoRestartMonitorInterval: 2000,

  // For log config
  logConfiguration: {

    // output folder
    output: "./logs",

    // console | file
    type: "console",  

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