import {default as Koa} from '../application.js';

const app = new Koa();

app.use((ctx) => {
  ctx.body = 'hello world';
  console.log(ctx.body);
});

app.listen(3000);
