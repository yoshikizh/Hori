class HoriRecordQuery {

  constructor(cls, mapping, options = {}){
    this.cls = cls
    this.mapping = mapping
    this.options = options
    this._page = null
    this._per = 1
    this._limit = null
    this._sort = null
  }

  _exec(){
    const p = new Promise(async(resolve,reject) => {
      const query = this.mapping.find(this.options)
      if (this._limit) {
        query.limit(this._limit)
      } else if (this._page && this._per) {
        query.skip((this._page - 1) * this._per).limit(this._per)
      }
      if (this._sort){
        query.sort(this._sort)
      }
      const array = []
      const result = await query
      result.forEach((obj)=>{
        const _obj = new this.cls();
        _obj.mapping_object = obj;
        _obj.id = obj.id
        array.push(_obj);
      })
      resolve(array)
    });
    return p;
  }

  page(n){
    this._page = n;
    return this;
  }

  per(n){
    this._per = n;
    return this;
  }

  limit(n){
    this._limit = n;
    return this;
  }

  sort(option){
    this._sort = option;
    return this;
  }

  where(options){
    Object.assign(this.options, options);
    return this;
  }

  async forEach(_yield){
    const array = await this._exec();
    for (let i = 0; i < array.length; i++){
      _yield(array[i],i)
    }
  }

  async map(_yield){
    const array = await this._exec();
    const new_array = []
    for (let i = 0; i < array.length; i++){
      new_array.push(_yield(array[i]))
    }
    return new_array;
  }

  async inject(key) {
    const array = await this._exec();
    const object = array.inject({},function(hash,obj){ hash[obj[key]] = obj; return hash })
    return object
  }

  async toArray(){
    const array = await this._exec();
    return array;
  }

  // will trigger exec
  async count(){
    const array = await this._exec()
    return array.length
  }

  async first(n = 0){
    const array = await this._exec()
    return array[n];
  }

  async last(n = 0){
    const array = await this._exec()
    return array[array.length-1-n];
  }
}

module.exports.HoriRecordQuery = HoriRecordQuery;