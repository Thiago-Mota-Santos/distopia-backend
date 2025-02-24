import { Context } from "koa";
import { dynamoClient } from "../../lib/dynamoClient";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = dynamoClient;

interface Member {
  id: number;
  name: string;
  avatarUrl: string;
  type: string;
  createdAt: number;
  updatedAt: number;
}

export const artistsHandler = async (ctx: Context): Promise<void> => {
  if (ctx.method !== "GET") {
    ctx.status = 500;
    ctx.body = { error: "405 Method Not Allowed" };
    return;
  }

  try {
    const QueryInput: QueryCommandInput = {
      ExpressionAttributeValues: { ":type": { S: "artist" } },
      ExpressionAttributeNames: { "#type": "type" },
      KeyConditionExpression: "#type = :type",
      IndexName: "typeIndex",
      TableName: "Members",
    };

    const { Items } = await client.send(new QueryCommand(QueryInput));

    ctx.status = 200;
    ctx.body = (Items ?? []).map((item) => unmarshall(item) as Member);
  } catch (err) {
    console.error("Error:", err);
    ctx.status = 500;
    ctx.body = { error: "500 Internal Server Error" };
  }
};
