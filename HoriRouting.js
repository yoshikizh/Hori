class HoriRouting {

  constructor(){
    this.table = [];
  }

  draw(_yield){
    _yield(this);
  }

  get(path,mapping){
    this.add("get",path,mapping);
  }

  post(path,mapping){
    this.add("post",path, mapping);
  }

  put(path,mapping){
    this.add("put",path,mapping);
  }

  patch(path,mapping){
    this.add("patch",path,mapping);
  }

  delete(path,mapping){
    this.add("delete",path,mapping);
  }

  match(path,mapping,methods = []){
    methods.forEach((_method) => {
      this.add(_method,path,mapping);
    })
  }

  resources(resource, options = {}){
    this.add("get", resource, `${resource}#index`);
    this.add("get",`${resource}/new`,`${resource}#new`);
    this.add("get",`${resource}/:id/edit`,`${resource}#edit`);
    this.add("get",`${resource}/:id`,`${resource}#show`);
    this.add("post",resource,`${resource}#create`);
    this.add("put",`${resource}/:id`,`${resource}#update`);
    this.add("delete",`${resource}/:id`,`${resource}#destroy`);
  }

  root(mapping_str){
    this.add("get","",mapping_str);
  }

  add(method,path,mapping){
    const route_object = new Object;

    let controller_name = null;
    let action_name = null;
    if (mapping){
      const mapping_arr = mapping.split("#");
      controller_name = mapping_arr[0];
      action_name = mapping_arr[1];
    } else {
      controller_name = path
      action_name = "index";
    }

    route_object.method = method;
    route_object.path = "/" + path;
    route_object.controller_name = controller_name;
    route_object.action_name = action_name;

    this.table.push(route_object);
  }
}

HoriRouting.table = [];

HoriRouting.create = () => {
  const routing = new HoriRouting();
  return routing;
}

module.exports = HoriRouting;
