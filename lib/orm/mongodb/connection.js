const mongoose = require('mongoose');

mongoose.connectDB = function(){
  const promise = new Promise((resolve, reject) => {
    let Config = Hori.config.database.mongodb
    if (!Config){
      resolve({
        resp: "error", msg: `can not found the mongodb config.`
      })
      return
    }

    const connect_uri = `mongodb://${Config.host}`;

    Hori.logger.info("[DB CONFIG]",Config)
    Hori.logger.info("[CONNECT URL]",connect_uri)


    this.connect(connect_uri, Config.option, function (err) {
      if (err) {
        Hori.logger.error("mongodb connect failed",err)
        resolve({
          resp: "error", msg: "connect to mongodb server error"
        })
      } else {
        Hori.logger.info("mongodb connected")
        resolve({resp: "success"})
      }
    });
  })
  return promise
}

module.exports.Mongoose = mongoose;
