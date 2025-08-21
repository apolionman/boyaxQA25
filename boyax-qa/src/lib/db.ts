import Database from "better-sqlite3";

const db = new Database("app.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    answer TEXT,
    answered INTEGER DEFAULT 0,
    created_at INTEGER
  )
`);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  completed_at INTEGER
)
`);

// Pieces progress table
db.exec(`
CREATE TABLE IF NOT EXISTS puzzle_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  piece_id TEXT NOT NULL,
  current_row INTEGER,
  current_col INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id)
)
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

// Initialize puzzleActive if not exists
const init = db.prepare("SELECT value FROM settings WHERE key = ?").get("puzzleActive");
if (!init) {
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("puzzleActive", "false");
}

export default db;
