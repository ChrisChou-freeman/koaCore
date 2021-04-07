import {default as Koa} from '../application.js';

const app = new Koa();

app.use(async ctx=> {
  ctx.body = 'hello world';
  console.log(ctx.body);
});

app.use(async ()=>{
  console.log('middleware 2');
})

app.listen(3000);
