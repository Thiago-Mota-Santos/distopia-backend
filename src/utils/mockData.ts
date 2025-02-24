import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "../lib/dynamoClient";

interface Art {
  id: string;
  memberId: number;
  type: "manga" | "gallery" | "animation";
  name: string;
  description: string;
  createdAt?: number;
  updatedAt?: number;
  cover: string;
}

interface Member {
  id: number;
  name: string;
  avatarUrl: string;
  type: string;
  createdAt: number;
  updatedAt: number;
}

interface GalleryItem {
  id: string;
  artId: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt?: number;
  deleted: number;
  expiresAt?: number;
}

const client = dynamoClient;

export async function mockDados() {
  const members = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    name: `Member ${i}`,
    avatarUrl: `https://picsum.photos/800/800?random=${700 + i}`,
    type: "artist",
    createdAt: Math.floor(Date.now() / 1000),
    updatedAt: Math.floor(Date.now() / 1000),
  }));

  const latestMangas = Array.from(
    { length: 50 },
    (_, i) =>
      ({
        id: `manga-${i + 1}`,
        type: "manga",
        name: `Manga ${i + 1}`,
        description: `Description ${i + 1}`,
        memberId: Math.floor(Math.random() * 21),
        cover: `https://picsum.photos/800/400?random=${i + 1}`,
      }) as Art,
  );
  const latestAnimation = Array.from(
    { length: 50 },
    (_, i) =>
      ({
        id: `animation-${i + 50}`,
        type: "animation",
        name: `Animation ${i}`,
        description: `Description ${i}`,
        memberId: Math.floor(Math.random() * 21),
        cover: `https://picsum.photos/800/400?random=${i}`,
      }) as Art,
  );
  const latestGallery = Array.from(
    { length: 50 },
    (_, i) =>
      ({
        id: `gallery-${i + 100}`,
        type: "gallery",
        name: `Gallery ${i}`,
        description: `Description ${i}`,
        memberId: Math.floor(Math.random() * 21),
        cover: `https://picsum.photos/800/400?random=${i}`,
      }) as Art,
  );

  const galleryItems = Array.from({ length: 10 }, (_, i) => ({
    id: `gallery-item-${i}`,
    artId: `gallery-${100 + Math.floor(Math.random() * 50)}`,
    title: `Gallery Item ${i}`,
    description: `Description ${i}`,
    imageUrl: `https://picsum.photos/600/900?random=${i}`,
    deleted: 0,
  }));

  members.forEach((m) => createMember(m));
  latestMangas.forEach((i) => createArt(i));
  latestAnimation.forEach((i) => createArt(i));
  latestGallery.forEach((i) => createArt(i));
  galleryItems.forEach((i) => createGalleryItem(i));
}

export async function createMember(member: Member) {
  const command = new PutCommand({
    TableName: "Members",
    Item: member,
  });

  client.send(command);
}

export async function createArt(art: Art) {
  art.createdAt =
    Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 10) * 86400;
  art.updatedAt = art.createdAt + Math.floor(Math.random() * 10) * 86400;

  const command = new PutCommand({
    TableName: "Arts",
    Item: art,
  });

  client.send(command);
}

export async function createGalleryItem(item: GalleryItem) {
  item.createdAt =
    Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 10) * 86400;
  const command = new PutCommand({
    TableName: "GalleryItems",
    Item: item,
  });

  client.send(command);
}
