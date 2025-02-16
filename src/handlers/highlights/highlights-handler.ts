import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Context } from 'koa';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: "us-east-1" });

export const highlightsHandlerPost = async (ctx: Context): Promise<void> => {
  const { name, url } = ctx.request.body;

  if (!name || !url) {
    ctx.status = 400;
    ctx.body = { error: "Name and URL are required" };
    return;
  }

  const id = uuidv4(); 

  const params = {
    TableName: "Highlights",
    Item: {
      id: { S: id },
      name: { S: name },
      url: { S: url }   
    }
  };

  try {
    const command = new PutItemCommand(params);
    await client.send(command);
    ctx.status = 201;
    ctx.body = { message: "Highlight created successfully", id };
  } catch (error) {
    console.error("Error creating highlight:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};