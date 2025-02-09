import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { RssItem } from '@/types/rss';

interface AppDB extends DBSchema {
  feeds: {
    key: string;
    value: RssItem;
    indexes: { 'by-date': string };
  };
  favorites: {
    key: string;
    value: { guid: string };
  };
}

const DB_NAME = 'openrss-db';
const DB_VERSION = 1;

export async function initDB() {
  return await openDB<AppDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const feedStore = db.createObjectStore('feeds', {
        keyPath: 'guid'
      });
      feedStore.createIndex('by-date', 'pubDate');
      
      db.createObjectStore('favorites', {
        keyPath: 'guid'
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

export async function addFeeds(feeds: RssItem[]) {
  const db = await getDB();
  const tx = db.transaction('feeds', 'readwrite');
  await Promise.all(feeds.map(feed => tx.store.put(feed)));
  await tx.done;
}

export async function getFeeds() {
  const db = await getDB();
  return await db.getAllFromIndex('feeds', 'by-date');
}

export async function toggleFavorite(guid: string) {
  const db = await getDB();
  const tx = db.transaction('favorites', 'readwrite');
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
  return await db.getAll('favorites');
}