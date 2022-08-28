class Hori {
  constructor(){
    this.binPath = null;
    this.root = null;
    this.npmRoot = null;
    this.app = null;
  }

  initialize(){
    this.binPath = process.execPath
    this.root = process.cwd()
    this.npmRoot = __dirname
  }

  run(){
    this.express = require('express');
    this.app = this.express();

    this.app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    this.app.listen(3000, "0.0.0.0");
  }
}

module.exports = new Hori();
