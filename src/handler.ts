import Koa from "koa";
import Router from "@koa/router";
import {
  DynamoDBClient,
  KeyType,
  ScalarAttributeType,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { highlightsHandlerPost } from "./handlers/highlights/highlights-handler";
import { highlightsHandlerGet } from "./handlers/highlights/highligths-handler-get";
import { highlightsHandlerGetAll } from "./handlers/highlights/highlights-handler-getAll";
import { recentVideosHandlers } from "./handlers/recent-videos/recent-videos-handler";
import { latestTweetsHandler } from "./handlers/tweets/latest-tweets-handler";
import { liveStatusHandler } from "./handlers/live-status/live-status-handler";
import { artistsHandler } from "./handlers/artists/artists-handler";
import { latestArtsUpdatesHandler } from "./handlers/latest-updates/latest-updates-handler";
import { artsHandler } from "./handlers/arts/arts-handler";
import { inicializarTabelas } from "./utils/inicializaTabelas";
import { catalogHandler } from "./handlers/catalog/catalog-handler";

const app = new Koa();
const router = new Router();

const client = new DynamoDBClient();
// move docClient to each route handler
const docClient = DynamoDBDocumentClient.from(client);

app.use(cors());
app.use(bodyParser());

// highlights
router.post("/highlight", highlightsHandlerPost);
router.get("/highlight/:id", highlightsHandlerGet);
router.get("/highlight", highlightsHandlerGetAll);

// recent videos
router.get("/recent-videos", recentVideosHandlers);

// tweets
router.get("/tweets", latestTweetsHandler);

//live-status
router.get("/live-status", liveStatusHandler);

//artists
router.get("/artists", artistsHandler);

//latest
router.get("/latest-arts", latestArtsUpdatesHandler);

//arts
router.get("/arts", artsHandler);

//catalog
router.get("/catalog", catalogHandler);

app.use(router.routes());
app.use(router.allowedMethods());
app.use((ctx) => {
  ctx.status = 404;
  ctx.body = { error: "Not Found" };
});

if (process.env.NODE_ENV === "development") {
  inicializarTabelas();
}

export default app;
