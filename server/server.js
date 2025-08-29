import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDB } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function ensureSchema() {
const db = await getDB();
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
await db.exec(schema);
}


const PORT = process.env.PORT || 4000;


if (process.argv.includes('--init-db')) {
ensureSchema().then(() => {
console.log('DB initialized');
process.exit(0);
});
} else {
ensureSchema().then(() => {
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
});
}