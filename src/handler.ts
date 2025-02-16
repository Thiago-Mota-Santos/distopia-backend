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
import { highlightsHandlerPost } from './handlers/highlights/highlights-handler';
import { highlightsHandlerGet } from './handlers/highlights/highligths-handler-get';
import { highlightsHandlerGetAll } from './handlers/highlights/highlights-handler-getAll';

const app = new Koa();
const router = new Router();

const client = new DynamoDBClient();
// move docClient to each route handler
const docClient = DynamoDBDocumentClient.from(client);

app.use(cors());
app.use(bodyParser());

router.post('/highlight', highlightsHandlerPost)
router.get('/highlight/:id', highlightsHandlerGet)
router.get('/highlight', highlightsHandlerGetAll)

app.use(router.routes());
app.use(router.allowedMethods());
app.use((ctx) => {
  ctx.status = 404;
  ctx.body = { error: "Not Found" };
});

export default app;
