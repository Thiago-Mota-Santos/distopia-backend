import { Context } from "koa";
import getAllFromTable from "../../utils/getAllfromTable";
import { dynamoClient } from "../../lib/dynamoClient";
import { PutItemCommand, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { config } from "../../config";

const client = dynamoClient

export const liveStatusHandler = async (ctx: Context): Promise<void> => {
  try {
    const cachedTwitch = await getAllFromTable<LiveStatusCacheTable>("TwitchCacheTable");
    let status = cachedTwitch.find(c => c.key === 'LiveStatus')
    if(status) {
      ctx.status = 200;
      ctx.body = { isOnline: status.value };
      return;
    }

    let token = cachedTwitch.find(c => c.key === 'BearerToken')?.value as TwitchBearerToken | undefined;
    if(!token) {
      token = await generateBearerToken();
      saveItem(token, Math.floor(Date.now() / 1000) + token.expires_in)
    }

    const isOnline = await getStatusLive(token.access_token)
      .then((res) => res.data.length > 0);
    saveItem(isOnline, Math.floor(Date.now() / 1000) + 60)

    ctx.status = 200;
    ctx.body = { isOnline };
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { message: "Internal Server Error" };
  }
};

async function getStatusLive(bearerToken: string): Promise<TwitchHelixStream> {
  return fetch("https://api.twitch.tv/helix/streams?user_login=distopiapdc", {
    headers: {
      "Client-ID": "sykcqtgokktkdhjoiv9rvqys434wlw",
      "Authorization": "Bearer " + bearerToken
    }
  }).then((res) => res.json());
}

function saveItem(item: TwitchBearerToken | boolean, expiresAt: number): Promise<PutItemCommandOutput> {
  const save = {
    key: typeof item === 'boolean' ? 'LiveStatus' : 'BearerToken',
    expiresAt: expiresAt,
    value: item
  }

  const command = new PutItemCommand({
    TableName: "TwitchCacheTable",
    Item: marshall(save)
  });
  return client.send(command);
}

async function generateBearerToken(): Promise<TwitchBearerToken> {
  const params = new URLSearchParams({
    client_id: config.TWITCH_CLIENT_ID!,
    client_secret: config.TWITCH_CLIENT_SECRET!,
    grant_type: "client_credentials",
  })
  const url = "https://id.twitch.tv/oauth2/token?" + params.toString();

  return fetch(url, { method: "POST" }).then((res) => res.json());
}
