class HoriApplication {
  constructor(hori){
    this.hori = hori
    this.routes = null;
    this.controllers = {};
  }

  initialize(){
    this.routes = require('./HoriRouting.js').create();
  }

  run(){
    this.setMiddleware();
    this.setRouting()
    this.startMappingRoute();
    this.listen()
  }

  async execAction(req, res, action){
    if (!res.finished){
      await action(req, res);
    }
  }

  async checkAndExecBeforeAction(req, res, Controller, controller, action_name) {
    const ancestorControllers = []
    if (Controller.beforeAction){
      ancestorControllers.push(Controller)
    }

    let _Controller = Controller

    while ( _Controller.__proto__ && _Controller.__proto__.beforeAction ){
      _Controller = _Controller.__proto__
      ancestorControllers.push(_Controller)
    }

    for (var i = 0; i < ancestorControllers.length; i++){
      _Controller = ancestorControllers[i];
      const before_action_proc = _Controller.beforeAction;
      if (before_action_proc) {
        const before_action_config = before_action_proc();

        for(let j = 0; j < before_action_config.length; j++){
          const config = before_action_config[j];
          const before_action_name = config.name;
          const only_action_arr = config.only;
          const except_action_arr = config.except;
          if (before_action_name) {
            let before_action = controller[before_action_name];
            if (before_action) {
              before_action = before_action.bind(controller);
              if (only_action_arr) {
                if (only_action_arr.includes(action_name)){
                  await this.execAction(req, res, before_action);
                }
              } else if (except_action_arr) {
                if (!except_action_arr.includes(action_name)){
                  await this.execAction(req, res, before_action);
                }
              } else {
                await this.execAction(req, res, before_action);
              }
            }
          }
        }
      }
    }
  }

  async createControllerContext(req, res, Controller, controller_name, action_name){
    this.hori.logger.info(`[${Date.now()}] -- : Started ${req.method} ${req.url} Processing by ${controller_name}#${action_name}`);
    if (req.method === "POST") {
      this.hori.logger.info(`Parameters: ${JSON.stringify(req.body)}`)
    }

    try {
      const controller = new Controller(controller_name,action_name);
      controller.req = req;
      controller.res = res;
      
      const params = {}
      Object.assign(params, req.params)
      Object.assign(params, req.query)
      Object.assign(params, req.body)

      controller.params = params

      let action = controller[action_name];
      if (!action) {
        res.status(500).send(`Can not find the action ${action_name}`);
        return
      }
      action = action.bind(controller);
      if (action){
        await this.checkAndExecBeforeAction(req, res, Controller, controller, action_name);
        await this.execAction(req, res, action);
      }
    } catch (e) {
      if (this.hori.env === "development") {
        console.log(e.stack)
        res.status(500).send(e.stack);
      } else {
        res.status(500).send('Server is busy, please try later .');
      }
      this.hori.logger.error(e);
    }
  }

  startMappingRoute(){
    this.routes.table.forEach((routing) => {
      
      const controller_name = routing.controller_name;
      let Controller = this.controllers[controller_name]
      if (!Controller){
        Controller = require(`${this.hori.root}/app/controllers/${controller_name}Controller`)
        this.controllers[controller_name] = Controller
      }

      if (Controller){
        const path = routing.path;
        const method = routing.method;
        const action_name = routing.action_name;

        if (method === "get"){
          this.hori.express.get(path, (req, res) => {
            this.createControllerContext(req, res, Controller, controller_name, action_name)
          })
        }
        if (method === "post"){
          this.hori.express.post(path, (req, res) => {
            this.createControllerContext(req, res, Controller, controller_name, action_name)
          })
        }
        if (method === "put"){
          this.hori.express.put(path, (req, res) => {
            this.createControllerContext(req, res, Controller, controller_name, action_name)
          })
        }
        if (method === "delete"){
          this.hori.express.delete(path, (req, res) => {
            this.createControllerContext(req, res, Controller, controller_name, action_name)
          })
        }
        // if (method === "patch")
        //   this.hori.express.patch(path, action);
      }
    })
  }


  setRouting(){
    require(`${this.hori.root}/config/routes`);
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

    // set middleware from config
    const middlewares = require(`${this.hori.root}/config/middlewares`)
    middlewares.forEach((middleware)=>{
      this.hori.express.use(middleware)
    })
  }

  listen(){
    const port = this.hori.config.port
    Hori.debug(`${this.hori.config.appName} (Hori) web server (v${this.hori.npmInfo.version})`)
    Hori.debug(`Listening on localhost:${port}, CTRL+C to stop`)
    this.hori.express.listen(port, "0.0.0.0");
  }
}

HoriApplication.create = (hori) => {
  return new HoriApplication(hori)
}

module.exports = HoriApplication;