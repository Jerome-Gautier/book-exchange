Migration to MongoDB (Mongoose)

Files added:
- src/db/models/User.ts — Mongoose model for users
- src/db/models/Book.ts — Mongoose model for books
- src/db/models/Request.ts — Mongoose model for requests
- src/db/models/Trade.ts — Mongoose model for trades
- scripts/migrate-json-to-mongo.ts — One-time migration script to read src/lib/data/*.json and upsert into MongoDB

How to run:
1. Set MONGO_URI in your .env file (same format used by src/db/connect.ts).
2. Install dependencies: npm install mongoose
3. Run TypeScript node or compile and run the script, for example using ts-node:
   npx ts-node scripts/migrate-json-to-mongo.ts

Notes:
- The script is defensive about legacy shapes (it tolerates some older field names).
- It performs upserts so you can re-run if needed.
- After migration, you'll want to update server routes to read/write from MongoDB instead of the JSON files.
