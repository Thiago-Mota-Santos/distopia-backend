import { Context } from "koa";
import { dynamoClient } from "../../lib/dynamoClient";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

interface GalleryItem {
  id: string;
  artId: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: number;
  deleted: number;
  expiresAt: number;
}

const client = dynamoClient;

export const catalogHandler = async (ctx: Context): Promise<void> => {
  if (ctx.method !== "GET") {
    ctx.status = 500;
    ctx.body = { error: "405 Method Not Allowed" };
    return;
  }

  try {
    const QueryInput: QueryCommandInput = {
      ExpressionAttributeValues: { ":deleted": { N: "0" } },
      KeyConditionExpression: "deleted = :deleted",
      IndexName: "nonDeletedItemsIndex",
      TableName: "GalleryItems",
      Limit: 10,
      ScanIndexForward: false,
    };

    const { Items } = await client.send(new QueryCommand(QueryInput));

    ctx.status = 200;
    ctx.body = {
      content: (Items ?? []).map((item) => unmarshall(item) as GalleryItem),
    };
  } catch (err) {
    console.error("Error:", err);
    ctx.status = 500;
    ctx.body = { error: "500 Internal Server Error" };
  }
};
