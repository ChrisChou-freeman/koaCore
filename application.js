
'use strict';

import {default as http} from 'http';
import {default as EventEmitter} from 'events';
import {default as context} from './context.js';
import {default as request} from './request.js';
import {default as response} from './response.js';
import {default as Stream} from 'stream';

class Koa extends EventEmitter {
  constructor () {
    super();
    this.middlewares = [];
    this.context = context;
    this.request = request;
    this.response = response;
  }

  use (fn) {
    this.middlewares.push(fn);
  }

  createContext(req, res){
    const ctx = Object.create(this.context);
    const request = ctx.request = Object.create(this.request);
    const response = ctx.response = Object.create(this.response);
    ctx.req = request.req = response.req = req;
    ctx.res = request.res = response.res = res;
    request.ctx = response.ctx = ctx;
    request.response = response;
    response.request = request;
    return ctx;
  }

  compose(middlewares, ctx){
    function dispatch(index){
      if(index === middlewares.length) return Promise.resolve();
      const middleware = middlewares[index];
      return Promise.resolve(middleware(ctx, () => dispatch(index + 1)));
    }
    return dispatch(0);
  }

  handleRequest(req,res){
    res.statusCode = 404;
    const ctx = this.createContext(req, res);
    const fn = this.compose(this.middlewares, ctx);
    fn.then(()=>{
      if(typeof ctx.body == 'object'){
        res.setHeader('Content-Type', 'application/json;charset=utf8');
        res.end(JSON.stringify(ctx.body));
      } else if (ctx.body instanceof Stream){
        ctx.body.pipe(res);
      }
      else if (typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) {
        res.setHeader('Content-Type', 'text/htmlcharset=utf8');
        res.end(ctx.body);
      } else {
        res.end('404 Not found');
      }
    }).catch(err=>{
      this.emit('error', err);
      res.statusCode = 500;
      res.end('server error');
    });
  }

  listen (...args) {
    const server = http.createServer(this.handleRequest.bind(this));
    server.listen(...args);
  }

  callback(){
    return this.handleRequest.bind(this);
  }
}

export default Koa;
