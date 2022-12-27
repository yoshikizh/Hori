module.exports = (() => {
  class HoriApplicationController {
    constructor(controller_name, action_name){
      this.req = null;
      this.res = null;
      this.params = null;
      this.controller_name = controller_name;
      this.action_name = action_name;
      this.layout_name = "application";
      this.rendered = false
    }

    renderJSON(object){
      this.makeBaseHeaders()
      this.res.header("Content-Type","application/json;charset=utf-8")
      this.res.json(object);
      this.rendered = true
    }

    renderHtml(text){
      this.makeBaseHeaders()
      this.res.header("Content-Type","text/html;charset=utf-8")
      this.res.send(text);
      this.rendered = true
    }

    render(options = {}){
      this.makeBaseHeaders()
      this.res.header("Content-Type","text/html;charset=utf-8")
      if (options["layout"] === false){
        const view_html = this.renderView(`${this.controller_name}/${this.action_name}`);
        this.res.send(view_html);
      } else {
        this.body_html = this.renderView(`${this.controller_name}/${this.action_name}`);
        const view_html = this.renderView(`layouts/${this.layout_name}_layout`);
        this.res.send(view_html);
      }
      this.rendered = true
    }

    renderView(fileToPath){
      const ejs = require('ejs');
      const fs = require('fs');
      const path = require('path');
      const layout_html = fs.readFileSync(path.join(Hori.root, 'app','views',`${fileToPath}.html.ejs`), 'utf8');
      return ejs.compile(layout_html)({self: this});
    }

    renderToString(viewPath){
      return this.renderView(viewPath);
    }

    yield(){
      return this.body_html;
    }

    makeBaseHeaders(){
      this.res.header("X-Powered-By", "Hori")
      this.res.header("Server", "Hori")
    }
  }
  return HoriApplicationController;
})();
