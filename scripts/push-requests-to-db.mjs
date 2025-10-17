import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('MONGO_URI not set'); process.exit(1); }

const FILE = path.resolve('./src/lib/data/copies/requests.json');

function revive(obj) {
  if (Array.isArray(obj)) return obj.map(revive);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k,v] of Object.entries(obj)) {
      if (typeof v === 'string') {
        // ObjectId-like
        if (/^[0-9a-fA-F]{24}$/.test(v)) {
          out[k] = new ObjectId(v);
          continue;
        }
        // ISO date-like
        if (/^\d{4}-\d{2}-\d{2}T/.test(v)) {
          out[k] = new Date(v);
          continue;
        }
      }
      out[k] = revive(v);
    }
    return out;
  }
  return obj;
}

async function main(){
  const raw = await fs.readFile(FILE,'utf8');
  const arr = JSON.parse(raw);
  const docs = arr.map(revive);

  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db();
  const col = db.collection('requests');

  const del = await col.deleteMany({});
  console.log('Deleted existing requests:', del.deletedCount);

  if (docs.length) {
    const res = await col.insertMany(docs);
    console.log('Inserted requests:', res.insertedCount);
  } else console.log('No docs to insert');

  await client.close();
}

main().catch(err => { console.error(err); process.exit(1); });
