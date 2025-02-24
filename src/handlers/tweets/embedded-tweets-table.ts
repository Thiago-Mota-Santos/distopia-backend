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
const TABLE_NAME = "EmbeddedTweets";

export const createEmbeddedTweetsTable = async () => {
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
    console.log("Tabela 'EmbeddedTweets' criada com sucesso");
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
