const ApplicationController = require("./ApplicationController")

class HomeController extends ApplicationController {
	async index(){
		this.renderJSON({msg: "Hello Hori."})
	}
}

module.exports = HomeController