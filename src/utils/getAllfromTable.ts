import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { dynamoClient } from "../lib/dynamoClient";

const client = dynamoClient

export default async function getAllFromTable<T>(tableName: string): Promise<T[]> {
  const { Items } = await client.send(new ScanCommand({ TableName: tableName }))
  return (Items ?? []).map((item) => unmarshall(item) as T);
}
