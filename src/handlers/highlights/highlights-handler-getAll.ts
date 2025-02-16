import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { Context } from "koa";

const client = new DynamoDBClient({ region: "us-east-1" });

export const highlightsHandlerGetAll = async (ctx: Context): Promise<void> => {
  try {
    const params = {
      TableName: "Highlights",
    };

    const command = new ScanCommand(params);
    const { Items } = await client.send(command);

    if (!Items || Items.length === 0) {
      ctx.status = 404;
      ctx.body = { error: "No highlights found" };
      return;
    }

    
    const highlights = Items.map((item) => ({
      id: item.id?.S,
      name: item.name?.S,
      url: item.url?.S,
    }));

    ctx.status = 200;
    ctx.body = highlights;
  } catch (error) {
    console.error("Error fetching highlights:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};
