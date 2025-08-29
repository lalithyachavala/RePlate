import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '../db.js';


const router = Router();


router.post('/register', async (req, res) => {
const { name, email, password, role } = req.body;
if (!name || !email || !password || !role) {
return res.status(400).json({ error: 'Missing fields' });
}
try {
const db = await getDB();
const hash = await bcrypt.hash(password, 10);
await db.run(
'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
[name, email, hash, role]
);
return res.json({ message: 'Registered' });
} catch (e) {
if (e.message.includes('UNIQUE')) return res.status(409).json({ error: 'Email already registered' });
return res.status(500).json({ error: 'Server error' });
}
});


router.post('/login', async (req, res) => {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ error: 'Missing email/password' });
try {
const db = await getDB();
const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
if (!user) return res.status(401).json({ error: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.password_hash);
if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
} catch (e) {
return res.status(500).json({ error: 'Server error' });
}
});


export default router;