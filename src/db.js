import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'mundiales.db');

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS mundiales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    anio INTEGER NOT NULL,
    sede TEXT NOT NULL,
    campeon TEXT NOT NULL,
    subcampeon TEXT NOT NULL,
    goleador TEXT NOT NULL,
    equipos INTEGER NOT NULL,
    imagen TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    resumen TEXT NOT NULL,
    descripcion TEXT NOT NULL
  )
`);

export default db;