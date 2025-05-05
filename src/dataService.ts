import { openDB } from 'idb';
import { db, runQuery } from './db';

const dbName = 'my-app-db';
const storeName = 'ndjson-data';

// Initialize IndexedDB
const initIndexedDB = async () => {
  try {
    await openDB(dbName, 1, {
      upgrade(db) {
        db.createObjectStore(storeName);
      },
    });
  } catch (error) {
    console.error('Error initializing IndexedDB:', error);
  }
};

initIndexedDB();

// Save a single line to IndexedDB
export const saveLine = async (ndjsonLine: string) => {
  try {
    const dbInstance = await openDB(dbName, 1);
    await dbInstance.put(storeName, ndjsonLine);
  } catch (error) {
    console.error('Error saving line to IndexedDB:', error);
  }
};

// Query the SQLite database
export const query = (sqlQuery: string): any[] => {
  return runQuery(sqlQuery);
};
