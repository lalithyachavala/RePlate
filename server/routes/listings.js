import { Router } from 'express';
import { getDB } from '../db.js';
import { authRequired } from '../middleware/auth.js';


const router = Router();


// Public: list open listings (with optional search)
router.get('/', async (req, res) => {
const q = (req.query.q || '').trim();
const db = await getDB();
const rows = q
? await db.all("SELECT l.*, u.name AS owner_name FROM listings l JOIN users u ON u.id=l.created_by WHERE status='open' AND (title LIKE ? OR pickup_location LIKE ?) ORDER BY l.created_at DESC", [`%${q}%`, `%${q}%`])
: await db.all("SELECT l.*, u.name AS owner_name FROM listings l JOIN users u ON u.id=l.created_by WHERE status='open' ORDER BY l.created_at DESC");
res.json(rows);
});


// Create listing (host only recommended but allow all authenticated)
router.post('/', authRequired, async (req, res) => {
const { title, description, quantity, pickup_location, expires_at } = req.body;
if (!title || !pickup_location) return res.status(400).json({ error: 'Missing title/pickup_location' });
const db = await getDB();
const result = await db.run(
'INSERT INTO listings (title, description, quantity, pickup_location, expires_at, created_by) VALUES (?, ?, ?, ?, ?, ?)',
[title, description || '', quantity || '', pickup_location, expires_at || null, req.user.id]
);
const listing = await db.get('SELECT * FROM listings WHERE id = ?', [result.lastID]);
res.json(listing);
});


// Claim listing
router.post('/:id/claim', authRequired, async (req, res) => {
const { note } = req.body;
const { id } = req.params;
const db = await getDB();
const listing = await db.get('SELECT * FROM listings WHERE id = ?', [id]);
if (!listing) return res.status(404).json({ error: 'Listing not found' });
if (listing.status !== 'open') return res.status(400).json({ error: 'Listing not open' });
await db.run('INSERT INTO claims (listing_id, claimant_id, note) VALUES (?, ?, ?)', [id, req.user.id, note || null]);
await db.run("UPDATE listings SET status='claimed' WHERE id = ?", [id]);
res.json({ message: 'Claimed' });
});


// My listings (created)
router.get('/mine', authRequired, async (req, res) => {
const db = await getDB();
const rows = await db.all('SELECT * FROM listings WHERE created_by = ? ORDER BY created_at DESC', [req.user.id]);
res.json(rows);
});


// Complete a listing (owner only)
router.post('/:id/complete', authRequired, async (req, res) => {
const { id } = req.params;
const db = await getDB();
const listing = await db.get('SELECT * FROM listings WHERE id = ?', [id]);
if (!listing) return res.status(404).json({ error: 'Listing not found' });
if (listing.created_by !== req.user.id) return res.status(403).json({ error: 'Not owner' });
await db.run("UPDATE listings SET status='completed' WHERE id = ?", [id]);
res.json({ message: 'Completed' });
});


export default router;