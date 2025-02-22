import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const REGION = "us-east-1";

const client = new DynamoDBClient({
  region: REGION,
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "AKIA3M7ACNTRVPCKCASM",
    secretAccessKey: "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",
  },
});

const dynamoClient = DynamoDBDocumentClient.from(client);

export { dynamoClient };
