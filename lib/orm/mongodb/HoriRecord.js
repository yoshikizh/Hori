const Mongoose = require("./connection.js").Mongoose;
const HoriRecordQuery = require("./HoriRecordQuery.js").HoriRecordQuery;

class HoriRecord {

  /*
   * @method constructor - dont call the function directly. please use .new() class method .
  */
  constructor(){
    this.columns = {}
    this.mapping_object = null;
    this.id = null;
  }

  /*
   * @method save - save to db.
   * @return -> Promise
  */
  save(){
    var _this = this;
    const promise = new Promise((resolve, reject) => {
      this.mapping_object.save(function(err) {
        if (err) {
          _this.error = err
          resolve(false)
        } else {
          resolve(true)
        }
      })
    });
    return promise;
  }
}

// HoriRecord.findOne = (mapping,option) => {
//   const p = new Promise((resolve,reject) => {
//     mapping.findOne(option,(err,result)=>{
//       if (err) {
//         reject(err);
//       } else {
//         resolve(result);
//       }
//     })
//   });
//   return p;
// }

HoriRecord.where = (cls,mapping,option) => {
  const query =  new HoriRecordQuery(cls,mapping,option);
  return query;

  // const p = new Promise((resolve,reject) => {
  //   mapping.find(option,(err,result)=>{
  //     const active_record_query = new HoriRecordQuery(cls,mapping,option);
  //     result.forEach((obj)=>{
  //       const _obj = new cls();
  //       _obj.mapping_object = obj;
  //       active_record_query.push(_obj);
  //     })
  //     if (err) {
  //       reject(err);
  //     } else {
  //       resolve(active_record_query);
  //     }
  //   });
  // });
  // return p;
}

HoriRecord.new = (cls,mapping,option) => {
  const obj = new mapping(option);
  const _obj = new cls(obj);
  _obj.mapping_object = obj;
  return _obj;
}

HoriRecord._defineProperty = (cls,key) => {
  Object.defineProperty(cls.prototype, key, {
    get: function() {
      return this.mapping_object[key];
    },
    set: function(value) {
      this.mapping_object[key] = value;
    },
    configurable: true
  });
}

HoriRecord.staticMethodCopy = (cls,mapping,schema_config) => {
  HoriRecord._defineProperty(cls,"_id");
  Object.keys(schema_config).forEach((key)=>{
    HoriRecord._defineProperty(cls,key);
  })
  if (cls.plugins){
    if (cls.plugins.map(obj=>obj.name).includes("timestampsPlugin")){
      HoriRecord._defineProperty(cls,"createdAt");
      HoriRecord._defineProperty(cls,"updatedAt");
    }
  }

  /*
   * @method all - Query All
   * @return -> Promise
  */
  cls.all = function(){
    return HoriRecord.where(cls,mapping,{});
  }

  /*
   * @method where - Query by conditions
   * @params option - pass to mongoose 
   * @return -> Promise
  */
  cls.where = function(option){
    return HoriRecord.where(cls,mapping,option);
  }  

  /*
   * @method findOne - Query by conditions
   * @params option - pass to mongoose 
   * @return -> Promise
  */
  cls.findOne = function(option){
    return HoriRecord.where(cls,mapping,option).first();
  }

  cls.page = function(n){
    return cls.where({}).page(n);
  }  

  /*
   * @method new - insert a data (will not save)
   * @params option - pass to mongoose 
   * @return -> Promise
  */
  cls.new = function(option){
    return HoriRecord.new(cls,mapping,option);
  }

  cls.create = function(option){
    const record = HoriRecord.new(cls,mapping,option);
    return record.save()
  }

  /*
   * @method destroyAll - delete all data
  */
  cls.destroyAll = function(option = {}){
    return mapping.deleteMany(option).exec();
  }

  cls.destroy = function(option = {}){
    const p = new Promise((resolve,reject) => {
      mapping.deleteOne(option,(err)=>{
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      })
    });
    return p;
  }

  /*
   * @method count - get counts.
  */
  cls.count = function(){
    return mapping.countDocuments();
  }

  /*
   * @method first - get the first row.
  */
  cls.first = function(n = 0){
    return cls.all().first(n)
  }
  
  /*
   * @method first - get the last row.
  */
  cls.last = function(n = 0){
    return cls.all().last(n)
  }

  cls.mongoose = mapping;
  HoriRecord.models.push(cls)
}

HoriRecord.connectDB = async () => {
  const result = await Mongoose.connectDB()
  return result
}

HoriRecord.connectDBWithExit = async () => {
  const result = await Mongoose.connectDB()
  if (result.resp === "error"){
    console.log(result.msg)
    process.exit(1);
  }
  return result
}

HoriRecord.disconnect = () => {
  Mongoose.disconnect()
  Mongoose.connections.forEach(connection => {
    const modelNames = Object.keys(connection.models)

    modelNames.forEach(modelName => {
      delete connection.models[modelName]
    })

    const collectionNames = Object.keys(connection.collections)
    collectionNames.forEach(collectionName => {
      delete connection.collections[collectionName]
    })
  })
}

HoriRecord.register = (cls) => {
  const schema_config = cls.fields() || {};
  const plugins = cls.plugins;
  const Schema = Mongoose.Schema;
  const db_schema = new Schema(schema_config, { minimize: false });
  if (plugins) {
    plugins.forEach((plugin) => {
      db_schema.plugin(plugin)
    })
  }
  const mapping = Mongoose.model(cls.name, db_schema);
  HoriRecord.staticMethodCopy(cls,mapping,schema_config)
}

HoriRecord.models = []
HoriRecord.connectDBWithExit()
module.exports = HoriRecord;
