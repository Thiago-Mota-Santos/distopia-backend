import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { Context } from "koa";
import { dynamoClient } from "../../lib/dynamoClient";
import { unmarshall } from "@aws-sdk/util-dynamodb";

interface Art {
  id: string;
  memberId: number;
  type: 'manga' | 'gallery' | 'animation';
  name: string;
  description: string;
  createdAt?: number;
  updatedAt?: number;
  cover: string;
}

const client = dynamoClient;

export const artsHandler = async (ctx: Context): Promise<void> => {
  if (typeof ctx.query?.type !== 'string' || ctx.query.nextToken && typeof ctx.query.nextToken !== 'string') {
    ctx.status = 404;
    ctx.body = { error: '404 Bad Request' };
    return;
  }

  try {
    const size = Number(ctx.query.size) || 8;
    const nextToken = ctx.query.nextToken;
    ctx.status = 200;
    ctx.body = await getItemsByType(ctx.query.type, size, nextToken);
  } catch(err) {
    console.error('Error:', err);
    ctx.status = 500;
    ctx.body = { error: '500 Internal Server Error' };
  }
}

async function getItemsByType(type: string, size: number, nextToken?: string): Promise<any> {
  const command: QueryCommandInput = {
    ExpressionAttributeNames: { '#type': 'type', },
    ExpressionAttributeValues: { ':type': { S: type } },
    KeyConditionExpression: '#type = :type',
    IndexName: 'TypeUpdatedAtIndex',
    TableName: 'Arts',
    ScanIndexForward: false,
    Limit: size,
    ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString('utf-8')) : undefined
  };

  const response = await client.send(new QueryCommand(command));
  return {
    content: response.Items?.map((item) => unmarshall(item) as Art),
    nextToken: response.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(response.LastEvaluatedKey)).toString('base64')
      : null
  }
}
