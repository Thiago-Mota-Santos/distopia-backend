import { Context } from "koa";
import { dynamoClient } from "../../lib/dynamoClient";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = dynamoClient;

interface Art {
  id: string;
  memberId: number;
  type: "manga" | "gallery" | "animation";
  name: string;
  description: string;
  createdAt?: number;
  updatedAt?: number;
  cover: string;
}

export const latestArtsUpdatesHandler = async (ctx: Context): Promise<void> => {
  if (!ctx.query.type || typeof ctx.query.type !== "string") {
    ctx.status = 404;
    ctx.body = { error: "404 Bad Request" };
    return;
  }

  try {
    ctx.status = 200;
    ctx.body = { content: await getArtsByType(ctx.query.type) };
  } catch (err) {
    console.error("Error:", err);
    ctx.status = 500;
    ctx.body = { error: "500 Internal Server Error" };
  }
};

async function getArtsByType(type: string): Promise<Art[]> {
  const command: QueryCommandInput = {
    ExpressionAttributeNames: { "#type": "type" },
    ExpressionAttributeValues: { ":type": { S: type } },
    KeyConditionExpression: "#type = :type",
    IndexName: "TypeUpdatedAtIndex",
    TableName: "Arts",
    ScanIndexForward: false,
    Limit: 5,
  };

  const { Items } = await client.send(new QueryCommand(command));
  return Items?.map((item) => unmarshall(item)) as Art[];
}
