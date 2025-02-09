import Koa from 'koa';
import Router from '@koa/router';
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { dynamoClient } from './lib/dynamoClient';
import { version } from '../package.json'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'


const app = new Koa()

// auth logic, to later
const routerAuth = new Router()

const routerOpen = new Router()

app.use(
  cors({
    origin: (ctx) => ctx.request.headers.origin || '*',
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposeHeaders: ['Content-Length'],
    maxAge: 86400,
  }),
)

app.proxy = true

app.use(bodyParser())
app.use(routerOpen.routes())


routerOpen.get('/api/status', (ctx) => {
  ctx.status = 200
  ctx.body = {
    status: 'OK',
    version,
  }
})

routerOpen.post('/items', async (ctx) => {
  try {
    const item = ctx.request.body;
    
    const params = {
      TableName: "MyTable",
      Item: item
    };

    await dynamoClient.send(new PutCommand(params));
    ctx.status = 201;
    ctx.body = { message: "Item criado com sucesso" };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: "Erro ao criar item" };
  }
});

routerOpen.get('/items/:id', async (ctx) => {
  try {
    const params = {
      TableName: "MyTable",
      Key: {
        id: ctx.params.id
      }
    };

    const { Item } = await dynamoClient.send(new GetCommand(params));
    ctx.body = Item ? unmarshall(Item) : {};
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: "Erro ao buscar item" };
  }
});

app.use((ctx) => {
  ctx.status = 404
})

export default app;