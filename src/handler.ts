import Koa from 'koa';
import Router from '@koa/router';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

const app = new Koa();
const router = new Router();

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

app.use(cors());
app.use(bodyParser());

router.get('/users/:userId', async (ctx) => {
  const params = {
    TableName: 'UserTableTest',
    Key: {
      userId: ctx.params.userId,
    },
  };

  try {
    const command = new GetCommand(params);
    const { Item } = await docClient.send(command);
    if (Item) {
      ctx.body = Item;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'User not found for provided "userId"' };
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: "Could not retrieve user" };
  }
});

router.post('/users', async (ctx) => {
  const { userId, name } = ctx.request.body;

  if (typeof userId !== 'string') {
    ctx.status = 400;
    ctx.body = { error: 'userId must be a string' };
    return;
  }

  if (typeof name !== 'string') {
    ctx.status = 400;
    ctx.body = { error: '"name" must be a string' };
    return;
  }

  const params = {
    TableName: 'UserTableTest',
    Item: { userId, name },
  };

  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    ctx.status = 201;
    ctx.body = { userId, name };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: "error to creating user" };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use((ctx) => {
  ctx.status = 404;
  ctx.body = { error: "Not Found" };
});

export default app;
