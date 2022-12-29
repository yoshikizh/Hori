class TestsController extends HoriApplicationController {
  async index(){
  	this.datetime = new Date().toString()
  }
}

module.exports = TestsController;
