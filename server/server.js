{/*import express from 'express';
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
}*/}

// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- DB SETUP ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "replate.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Database error:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// --- SIMPLE ROUTES ---

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Hello from RePlate backend!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Example: register user (simplified)
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 8);

  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashed],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: this.lastID, email });
    }
  );
});

// Example: login user (simplified)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  });
});

// --- START SERVER ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
