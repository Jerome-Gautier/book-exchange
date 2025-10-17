import { MongoClient } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const OUT_DIR = path.resolve('./src/lib/data/copies');

if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

function normalizeDoc(doc) {
  const out = {};
  for (const [k, v] of Object.entries(doc)) {
    if (k === '_id') out._id = String(v);
    else if (v instanceof Date) out[k] = v.toISOString();
    else if (v && typeof v === 'object' && v._bsontype === 'ObjectID') out[k] = String(v);
    else out[k] = v;
  }
  return out;
}

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db();
  console.log('Connected to', db.databaseName || '');

  await fs.mkdir(OUT_DIR, { recursive: true });

  const collections = ['users','books','requests','trades'];
  for (const coll of collections) {
    const docs = await db.collection(coll).find({}).toArray();
    const normalized = docs.map(normalizeDoc);
    const outPath = path.join(OUT_DIR, `${coll}.json`);
    await fs.writeFile(outPath, JSON.stringify(normalized, null, 2), 'utf8');
    console.log('Wrote', outPath, 'count:', normalized.length);
  }

  await client.close();
}

main().catch(err => { console.error(err); process.exit(1); });
