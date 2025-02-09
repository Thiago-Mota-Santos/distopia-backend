import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const REGION = "us-east-1"; 

const client = new DynamoDBClient({
  region: REGION,
  endpoint: "http://localhost:5666",
  // credentials: {
  //   accessKeyId: "fake",
  //   secretAccessKey: "fake"
  // }
});

const dynamoClient = DynamoDBDocumentClient.from(client);

export { dynamoClient };