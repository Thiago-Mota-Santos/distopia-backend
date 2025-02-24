import { Context } from "koa";
import { config } from "../../config";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { dynamoClient } from "../../lib/dynamoClient";
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import getAllFromTable from "../../utils/getAllfromTable";

const client = dynamoClient

export const latestTweetsHandler = async (ctx: Context): Promise<void> => {
  try {
    const cachedTweets = await getAllFromTable<LatestTweet>("CachedTweets");
    if(cachedTweets.length > 0) return okBody(ctx, cachedTweets);

    const latestTweets: TwitterApiData[] = (await getLatestTweetsFromX()).data;
    const persistedTweets = await getAllFromTable<LatestTweet>("EmbeddedTweets");

    const notEmbeddedTweets = latestTweets.filter(i => !persistedTweets.find(p => p.id === i.id))
    const embeddedTweets = await getEmbeddedTweetsFromIframely(notEmbeddedTweets);
    if(embeddedTweets.length > 0) insertAllTweetsInPersistedTable(embeddedTweets);

    const tweets: LatestTweet[] = latestTweets
      .map(tweet =>  persistedTweets.find(p => p.id === tweet.id) ?? embeddedTweets.find(e => e.id === tweet.id))
      .filter(t => t !== undefined);

    insertAllTweetsInCacheTable(tweets);

    return okBody(ctx, tweets);
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { message: "Internal Server Error" };
  }
};

async function getEmbeddedTweetsFromIframely(latestTweets: TwitterApiData[]): Promise<LatestTweet[]> {
  const tweets: LatestTweet[] = [];
  const promises = latestTweets.map(async (tweet) => {
    const params = new URLSearchParams({
      url: encodeURI(`https://x.com/Distopialel/status/${tweet.id}`),
      api_key: config.IFRAMELY_API_KEY!,
      omit_script: "1",
      _theme: "dark",
    });

    return fetch(`https://iframe.ly/api/iframely?${params}`)
      .then((iframelyResponse) => iframelyResponse.json())
      .then((iframelyData) => {
        const blockquote = iframelyData.links.app[0].html.replace(
          '<script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>\n',
          "",
        );
        tweets.push({ id: tweet.id, blockquote, created_date: tweet.created_at });
      })
      .catch((err) => console.error(err));
    });

  await Promise.all(promises);
  return tweets;
}

function okBody(ctx: Context, tweets: LatestTweet[]) {
  ctx.status = 200;
  ctx.body = {
    tweets: tweets
      .sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
  };
  return;
}

async function getLatestTweetsFromX(): Promise<TwitterApiResponse> {
  const userId = "1658546449674559489";
  const x_api_url = `https://api.x.com/2/users/${userId}/tweets?max_results=15&tweet.fields=created_at&exclude=replies,retweets`;
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + config.X_BEARER_TOKEN,
    }
  };

  return await fetch(x_api_url, options)
    .then((response) => response.json())
    .catch((err) => {
      console.error(err);
      return { data: [] };
    });
}

function insertAllTweetsInPersistedTable(tweets: LatestTweet[]) {
  const params = {
    RequestItems: {
      EmbeddedTweets: tweets.map(Item => ({ PutRequest: { Item } }))
    }
  };
  client.send(new BatchWriteCommand(params));
  console.log("Embedded tweets atualizado");
}

function insertAllTweetsInCacheTable(tweets: LatestTweet[]) {
  const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60;
  const params = {
    RequestItems: {
      CachedTweets: tweets.map(tweet => ({ PutRequest: {
        Item: { ...tweet, expiresAt }
      } }))
    }
  };
  client.send(new BatchWriteCommand(params));
  console.log("Cache de tweets atualizado");
}
