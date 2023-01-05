class TestsController extends HoriApplicationController {
  async index(){
    console.log(8888)
    // const admin = await Admin.all().toArray()
    // console.log(1111, admin)
    this.datetime = new Date().toString()
  }
}

module.exports = TestsController;
