module.exports = {
  // For Hori
  appName: "Hori Api",

  // For log config
  logConfiguration: {

    output: "./logs",

    // console | file | dateFile
    type: "dateFile",  

    // out put level 
    level: "debug",    

    // blow if avaliable if type is file or dataFile
    file: {
      filename: "development",
      compress: true,

      // only for dataFile
      pattern: "yyyy-MM-dd-hh.log", 
      alwaysIncludePattern: true
    }
  }

  // For Application


}