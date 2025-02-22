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
import { recentVideosHandlers } from './handlers/recent-videos/recent-videos-handler';
import { latestTweetsHandler } from './handlers/tweets/latest-tweets-handler';
import { createCachedTweetsTable } from './handlers/tweets/cached-tweets-table';

const app = new Koa();
const router = new Router();

const client = new DynamoDBClient();
// move docClient to each route handler
const docClient = DynamoDBDocumentClient.from(client);

app.use(cors());
app.use(bodyParser());

// highlights
router.post('/highlight', highlightsHandlerPost)
router.get('/highlight/:id', highlightsHandlerGet)
router.get('/highlight', highlightsHandlerGetAll)

// recent videos
router.get("/recent-videos", recentVideosHandlers);

// tweets
createCachedTweetsTable();
router.get("/tweets", latestTweetsHandler);

app.use(router.routes());
app.use(router.allowedMethods());
app.use((ctx) => {
  ctx.status = 404;
  ctx.body = { error: "Not Found" };
});

export default app;
