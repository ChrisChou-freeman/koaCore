
'use strict';

const response = {
  get body(){
    return this._body;
  },

  set body(value){
    this.res.statusCode = 200;
    this._body = value;
  }
};

export default response;
// module.exports = response;
