import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { Context } from "koa";

const client = new DynamoDBClient({ region: "us-east-1" });

export const highlightsHandlerGet = async (ctx: Context): Promise<void> => {
  try {
    const { id } = ctx.params;

    if (!id) {
      ctx.status = 400;
      ctx.body = { error: "ID is required" };
      return;
    }

    const params = {
      TableName: "Highlights",
      Key: {
        id: { S: id },
      },
    };

    const command = new GetItemCommand(params);
    const { Item } = await client.send(command);

    if (!Item) {
      ctx.status = 404;
      ctx.body = { error: "Highlight not found" };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      id: Item.id.S,
      name: Item.name.S,
      url: Item.url.S,
    };
  } catch (error) {
    console.error("Error fetching highlight:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};
