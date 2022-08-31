module.exports = (() => {
  class HoriApplicationController {
    constructor(controller_name, action_name){
      this.req = null;
      this.res = null;
      this.params = null;
      this.controller_name = controller_name;
      this.action_name = action_name;
    }
    renderJSON(object){
      this.res.json(object);
    }
  }
  return HoriApplicationController;
})();
