class TestsController extends HoriApplicationController {
  async index(){
  	Hori.logger.debug("1234")
  	Hori.logger.info("1234")
  	Hori.logger.error("1234")
  	Hori.logger.warn("1234")

  	console.log("hahah")
  }
}

module.exports = TestsController;
