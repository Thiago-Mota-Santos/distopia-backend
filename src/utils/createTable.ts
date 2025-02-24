import { CreateTableCommand, CreateTableCommandInput, DescribeTableCommand, KeyType, ScalarAttributeType, UpdateTimeToLiveCommand } from "@aws-sdk/client-dynamodb";
import { dynamoClient } from "../lib/dynamoClient";

const client = dynamoClient;

export const createTable = async (TABLE_NAME: string, attributeName?: string, ttl?: string, tableParams?: CreateTableCommandInput) => {
  try {
    if (await checkTableExists(TABLE_NAME)) return;

    if(!tableParams)
    tableParams = {
      TableName: TABLE_NAME,
      KeySchema: [
        { AttributeName: attributeName ?? "id", KeyType: KeyType.HASH },
      ],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: ScalarAttributeType.S },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };

    await client.send(new CreateTableCommand(tableParams));
    console.log("Tabela '"+ TABLE_NAME +"' criada com sucesso");

    if (ttl === undefined) return;
    const ttlParams = {
      TableName: TABLE_NAME,
      TimeToLiveSpecification: {
        Enabled: true,
        AttributeName: ttl,
      },
    };

    await client.send(new UpdateTimeToLiveCommand(ttlParams));
    console.log("Time to live '" + TABLE_NAME + "' habilitado com sucesso");
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
