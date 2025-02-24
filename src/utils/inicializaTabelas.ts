import { KeyType, ScalarAttributeType } from "@aws-sdk/client-dynamodb";
import { createTable } from "./createTable";
import { mockDados } from "./mockData";

export async function inicializarTabelas() {
  createTable("EmbeddedTweets");
  createTable("CachedTweets", "id", "expiresAt");
  createTable("TwitchCacheTable", "key", "expiresAt");
  await createTable("Arts", undefined, "expiresAt", {
    TableName: "Arts",
    KeySchema: [
      { AttributeName: "id", KeyType: KeyType.HASH },
      { AttributeName: "type", KeyType: KeyType.RANGE },
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: ScalarAttributeType.S },
      { AttributeName: "type", AttributeType: ScalarAttributeType.S },
      { AttributeName: "updatedAt", AttributeType: ScalarAttributeType.N },
      { AttributeName: "memberId", AttributeType: ScalarAttributeType.N },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "TypeUpdatedAtIndex",
        KeySchema: [
          { AttributeName: "type", KeyType: KeyType.HASH },
          { AttributeName: "updatedAt", KeyType: KeyType.RANGE },
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
      {
        IndexName: "MemberIdUpdatedAtIndex",
        KeySchema: [
          { AttributeName: "memberId", KeyType: KeyType.HASH },
          { AttributeName: "updatedAt", KeyType: KeyType.RANGE },
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  });
  await createTable("Members", undefined, undefined, {
    TableName: "Members",
    KeySchema: [
      { AttributeName: "id", KeyType: KeyType.HASH },
      { AttributeName: "type", KeyType: KeyType.RANGE },
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: ScalarAttributeType.N },
      { AttributeName: "type", AttributeType: ScalarAttributeType.S },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    GlobalSecondaryIndexes: [
      {
        IndexName: "typeIndex",
        KeySchema: [
          { AttributeName: "type", KeyType: KeyType.HASH },
          { AttributeName: "id", KeyType: KeyType.RANGE },
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      },
    ],
  });
  await createTable("GalleryItems", undefined, undefined, {
    TableName: "GalleryItems",
    KeySchema: [{ AttributeName: "id", KeyType: KeyType.HASH }],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: ScalarAttributeType.S },
      { AttributeName: "artId", AttributeType: ScalarAttributeType.S },
      { AttributeName: "deleted", AttributeType: ScalarAttributeType.N },
      { AttributeName: "createdAt", AttributeType: ScalarAttributeType.N },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    GlobalSecondaryIndexes: [
      {
        IndexName: "artIdCreatedAtIndex",
        KeySchema: [
          { AttributeName: "artId", KeyType: KeyType.HASH },
          { AttributeName: "createdAt", KeyType: KeyType.RANGE },
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      },
      {
        IndexName: "nonDeletedItemsIndex",
        KeySchema: [
          { AttributeName: "deleted", KeyType: KeyType.HASH },
          { AttributeName: "createdAt", KeyType: KeyType.RANGE },
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      },
    ],
  });
  mockDados();
}
