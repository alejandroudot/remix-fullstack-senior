// app/infra/db/client.sqlite.ts
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('featurelab.db'); // mismo nombre que en drizzle.config.ts

export const db = drizzle(sqlite, { schema });
