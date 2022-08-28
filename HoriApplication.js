class HoriApplication {
  constructor(hori){
    this.hori = hori
  }

  run(){
    this.hori.app.post('/', (req, res) => {
      res.send('Hello World!')
    })
    const port = this.hori.config.port
    this.hori.logger.info("Hori web server (v0.0.1)")
    this.hori.logger.info(`Listening on localhost:${port}, CTRL+C to stop`)
    this.hori.app.listen(port, "0.0.0.0");
  }
}

HoriApplication.create = (hori) => {
  return new HoriApplication(hori)
}

module.exports = HoriApplication;