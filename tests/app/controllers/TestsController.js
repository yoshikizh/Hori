class TestsController extends HoriApplicationController {
  async index(){
    this.renderJSON({tests: "yes"});
  }
}

module.exports = TestsController;
