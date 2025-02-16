import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { isMainScript } from "../../utils/isMainScript";

async function createHighlightsTable() {
  const client = new DynamoDBClient({ region: "us-east-1" });

  const params = {
    TableName: "Highlights",
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" }, 
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "S" },  
      { AttributeName: "name", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  };

  try {
    const command = new CreateTableCommand(params);
    const result = await client.send(command);
    console.log("Tabela Highlights criada com sucesso!", result);
  } catch (error) {
    console.error("Erro ao criar tabela:", error);
  }
}

(async () => {
  if(!isMainScript(__filename)) {
    return;
  }

  await createHighlightsTable();
})();


