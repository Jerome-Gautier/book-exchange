// update-books-status.js
import fs from 'fs';

// Load books and trades (requests now use requestedBooks arrays)
const books = JSON.parse(fs.readFileSync('./src/lib/data/books.json', 'utf-8'));
const trades = JSON.parse(fs.readFileSync('./src/lib/data/trades.json', 'utf-8'));

// Get all pending trades
const pendingTrades = trades.filter(t => t.status === 'pending');

// Collect all offered and requested book IDs in pending trades
const requestedSet = new Set(pendingTrades.flatMap(t => {
  if (Array.isArray(t.requestedBooks)) return t.requestedBooks.map(rb => rb.id);
  if (t.requestedBookId) return [t.requestedBookId];
  return [];
}));

// Update each book with a status if it's in a pending trade
const updatedBooks = books.map(book => {
  if (requestedSet.has(book.id)) {
    return { ...book, status: "wanted" };
  }
  return { ...book, status: "available" };
});

// Write the updated books to a new file
fs.writeFileSync('books-with-status.json', JSON.stringify(updatedBooks, null, 2), 'utf-8');

console.log('books-with-status.json has been created.');