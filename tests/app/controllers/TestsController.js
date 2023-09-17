class TestsController extends HoriApplicationController {
  async index(){
    this.list = await Admin.all().toArray()
    this.datetime = new Date().toString()
  }
}

module.exports = TestsController;
 