import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Restore DB from JSON copies in src/lib/data/copies
// - converts 24-hex _id and *Id strings to ObjectId
// - converts ISO date strings to Date
// - clears each collection and inserts the documents

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const IN_DIR = path.resolve('./src/lib/data/copies');

if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

function reviveValue(v) {
  if (typeof v === 'string') {
    if (/^[0-9a-fA-F]{24}$/.test(v)) return new ObjectId(v);
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v)) return new Date(v);
    return v;
  }
  if (Array.isArray(v)) return v.map(reviveValue);
  if (v && typeof v === 'object') return reviveDoc(v);
  return v;
}

function reviveDoc(doc) {
  const out = {};
  for (const [k, v] of Object.entries(doc)) {
    if (k === '_id') out._id = (typeof v === 'string' && /^[0-9a-fA-F]{24}$/.test(v)) ? new ObjectId(v) : v;
    else if (k.endsWith('Id') && typeof v === 'string' && /^[0-9a-fA-F]{24}$/.test(v)) out[k] = new ObjectId(v);
    else out[k] = reviveValue(v);
  }
  return out;
}

async function readJson(filename) {
  const fp = path.join(IN_DIR, filename);
  const raw = await fs.readFile(fp, 'utf8');
  return JSON.parse(raw);
}

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db();
  console.log('Connected to', db.databaseName || '');

  const files = ['users', 'books', 'requests', 'trades'];
  const results = {};

  for (const f of files) {
    try {
      const arr = await readJson(`${f}.json`);
      const docs = arr.map(reviveDoc);

      const deleted = await db.collection(f).deleteMany({});
      console.log('Cleared', f, 'deleted:', deleted.deletedCount);

      let inserted = 0;
      if (docs.length) {
        const res = await db.collection(f).insertMany(docs);
        inserted = res.insertedCount;
      }
      console.log('Inserted', inserted, 'into', f);
      results[f] = { deleted: deleted.deletedCount, inserted };
    } catch (err) {
      console.warn('Skipping', f, ' —', err.message);
    }
  }

  await client.close();
  console.log('Restore complete:', results);
}

main().catch(err => { console.error(err); process.exit(1); });
