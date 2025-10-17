import fs from 'fs/promises';
import path from 'path';

const FILE = path.resolve('./src/lib/data/copies/requests.json');
const BOOKS_FILE = path.resolve('./src/lib/data/copies/books.json');

async function main() {
  const raw = await fs.readFile(FILE, 'utf8');
  const requests = JSON.parse(raw);
  const booksRaw = await fs.readFile(BOOKS_FILE, 'utf8');
  const books = JSON.parse(booksRaw);

  // build map ownerId -> bookIds
  const byOwner = new Map();
  for (const b of books) {
    const owner = b.ownerId || b.owner || b.ownerId;
    if (!owner) continue;
    const arr = byOwner.get(owner) || [];
    arr.push(b._id);
    byOwner.set(owner, arr);
  }

  let replaced = 0;

  for (const req of requests) {
    const offered = req.offeredBooks || [];
    if (offered.length <= 1) continue;

    // find duplicates
    const seen = new Map();
    for (let i = 0; i < offered.length; i++) {
      const id = offered[i];
      const count = seen.get(id) || 0;
      if (count === 0) {
        seen.set(id, 1);
        continue;
      }

      // duplicate found; try replace with another book owned by fromUser
      const ownerId = req.fromUser;
      const candidates = (byOwner.get(ownerId) || []).filter(x => !offered.includes(x));
      if (candidates.length) {
        offered[i] = candidates[ Math.floor(Math.random() * candidates.length) ];
        replaced++;
      }
      seen.set(id, count + 1);
    }
  }

  await fs.writeFile(FILE, JSON.stringify(requests, null, 2), 'utf8');
  console.log('done. replaced duplicates:', replaced);
}

main().catch(err => { console.error(err); process.exit(1); });
