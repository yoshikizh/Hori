class HoriApplication {
  constructor(hori){
    this.hori = hori
    this.routes = null;
  }

  initialize(){
    this.routes = require('./HoriRouting.js').create();
  }

  run(){
    this.setMiddleware();
    this.listen()
  }

  setMiddleware(){
    const path = require('path');
    this.hori.express.use(this.hori.libs.log4js.connectLogger(this.hori.libs.log4js.getLogger("http"), { level: 'auto' }));
    this.hori.libs.cookieParser = require('cookie-parser');
    this.hori.libs.bodyParser = require('body-parser');
    this.hori.express.use(this.hori.libs.bodyParser.json());
    this.hori.express.use(this.hori.libs.bodyParser.urlencoded({ extended: false }));
    this.hori.express.use(this.hori.libs.cookieParser());
    this.hori.express.use(this.hori.libs.express.static(path.join(this.hori.root, 'public')));
  }

  listen(){
    this.hori.express.get('/', (req, res) => {
      res.send('Hello World!')
    })
    const port = this.hori.config.port
    this.hori.logger.debug("Hori web server (v0.0.1)")
    this.hori.logger.debug(`Listening on localhost:${port}, CTRL+C to stop`)
    this.hori.express.listen(port, "0.0.0.0");
  }
}

HoriApplication.create = (hori) => {
  return new HoriApplication(hori)
}

module.exports = HoriApplication;