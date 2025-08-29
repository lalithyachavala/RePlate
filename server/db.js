import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function getDB() {
const db = await open({
filename: path.join(__dirname, 'zerowaste.db'),
driver: sqlite3.Database
});
await db.exec('PRAGMA foreign_keys = ON;');
return db;
}