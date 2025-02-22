import {
  DynamoDBClient,
  CreateTableCommand,
  UpdateTimeToLiveCommand,
  ScalarAttributeType,
  KeyType,
  BillingMode,
  DescribeTableCommand,
} from "@aws-sdk/client-dynamodb";
import { dynamoClient } from "../../lib/dynamoClient";

const client = dynamoClient;
const TABLE_NAME = "CachedTweets";

export const createCachedTweetsTable = async () => {
  try {
    if (await checkTableExists(TABLE_NAME)) return;

    const tableParams = {
      TableName: TABLE_NAME,
      KeySchema: [{ AttributeName: "id", KeyType: KeyType.HASH }],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: ScalarAttributeType.S },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };

    await client.send(new CreateTableCommand(tableParams));
    console.log("Tabela 'CachedTweets' criada com sucesso");

    const ttlParams = {
      TableName: TABLE_NAME,
      TimeToLiveSpecification: {
        Enabled: true,
        AttributeName: "expiresAt",
      },
    };

    await client.send(new UpdateTimeToLiveCommand(ttlParams));
    console.log("Time to live habilitado com sucesso");
  } catch (err) {
    console.error("Error:", err);
  }
};

async function checkTableExists(tableName: string): Promise<boolean> {
  return client
    .send(new DescribeTableCommand({ TableName: tableName }))
    .then(() => {
      console.log(`Tabela ${tableName} já existe`);
      return true;
    })
    .catch((err) => false);
}
