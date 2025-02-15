import { openDB, DBSchema, IDBPDatabase } from "idb";
import type { RssItem } from "@/types/rss";

interface AppDB extends DBSchema {
  episodes: {
    key: string;
    value: RssItem;
    indexes: { "by-date": string; "by-feedUrl": string };
  };
  favorites: {
    key: string;
    value: { guid: string };
  };
}

const DB_NAME = "openrss-db";
const DB_VERSION = 1;

export async function initDB() {
  return await openDB<AppDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const episodeStore = db.createObjectStore("episodes", {
        keyPath: "guid",
      });
      episodeStore.createIndex("by-date", "pubDate");
      episodeStore.createIndex("by-feedUrl", "feedUrl");

      db.createObjectStore("favorites", {
        keyPath: "guid",
      });
    },
  });
}

let dbPromise: Promise<IDBPDatabase<AppDB>>;

export function getDB() {
  if (!dbPromise) {
    dbPromise = initDB();
  }
  return dbPromise;
}

export async function addEpisodes(episodes: RssItem[]) {
  const db = await getDB();
  const tx = db.transaction("episodes", "readwrite");
  await Promise.all(episodes.map((episode) => tx.store.put(episode)));
  await tx.done;
}

export async function getEpisodes() {
  const db = await getDB();
  return await db.getAllFromIndex("episodes", "by-date");
}

export async function toggleFavorite(guid: string) {
  const db = await getDB();
  const tx = db.transaction("favorites", "readwrite");
  const exists = await tx.store.get(guid);

  if (exists) {
    await tx.store.delete(guid);
  } else {
    await tx.store.put({ guid: guid });
  }
  await tx.done;
}

export async function getFavorites() {
  const db = await getDB();
  return await db.getAll("favorites");
}

async function deleteAllEpisodes() {
  const db = await getDB();
  const tx = db.transaction("episodes", "readwrite");
  await tx.store.clear();
  await tx.done;
}

export async function deleteAllFavorites() {
  const db = await getDB();
  const tx = db.transaction("favorites", "readwrite");
  await tx.store.clear();
  await tx.done;
}

export async function deleteEpisodes(removeAll: boolean = false) {
  if (removeAll) {
    await deleteAllFavorites();
    await deleteAllEpisodes();
  } else {
    const db = await getDB();

    const tx = db.transaction(["episodes", "favorites"], "readwrite");

    const favorites = await tx.objectStore("favorites").getAll();
    const favoriteGuids = new Set(favorites.map((fav) => fav.guid));

    let cursor = await tx.objectStore("episodes").openCursor();

    while (cursor) {
      if (!favoriteGuids.has(cursor.value.guid)) {
        await cursor.delete();
      }
      cursor = await cursor.continue();
    }

    await tx.done;
  }
}

export async function updateEpisodeDownloadedStatus(
  guid: string,
  downloaded: boolean
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("episodes", "readwrite");
  const store = tx.store;
  const episode = await store.get(guid);
  if (episode) {
    episode.downloaded = downloaded;
    await store.put(episode);
  }
  await tx.done;
}
