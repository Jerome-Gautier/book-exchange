import fs from 'fs/promises';
import path from 'path';

const FILE = path.resolve('./src/lib/data/copies/requests.json');

async function main() {
  const raw = await fs.readFile(FILE, 'utf8');
  const requests = JSON.parse(raw);
  let totalDup = 0;
  const bad = [];
  for (const r of requests) {
    const offered = r.offeredBooks || [];
    const seen = new Set();
    for (const id of offered) {
      if (seen.has(id)) {
        totalDup++;
        bad.push({ requestId: r._id, duplicate: id });
      } else seen.add(id);
    }
  }
  console.log('total duplicate offeredBooks entries:', totalDup);
  if (bad.length) console.log('examples:', bad.slice(0,10));
}

main().catch(err => { console.error(err); process.exit(1); });
