class HomeController extends HoriApplicationController {
  async index(){
    this.renderJSON({hello: "world"});
  }
}

module.exports = HomeController;
