const proto = {};

function defineGetter(prop, name){
  proto.__defineGetter__(name, function(){
    return this[prop][name];
  });
}

function defineSetter (prop, name) {
  proto.__defineSetter__(name, function(val){
    this[prop][name] = val;
  });
}

defineGetter('request', 'url');
defineGetter('request', 'path');
defineGetter('response', 'body');
defineSetter('response', 'body');

export default proto;
