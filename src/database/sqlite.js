const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { databasePath } = require('../config');

function initDatabase() {
  try {
    const dataDir = path.dirname(databasePath);

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const db = new sqlite3.Database(databasePath, (error) => {
      if (error) {
        console.error('[DB] Erro ao conectar no SQLite:', error);
        return;
      }
      console.log('[DB] SQLite conectado com sucesso.');
    });

    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS profile (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          discord_user_id TEXT NOT NULL UNIQUE,
          display_name TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS unlocks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          discord_user_id TEXT NOT NULL,
          key TEXT NOT NULL,
          unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(discord_user_id, key)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS letters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          mood TEXT NOT NULL,
          unlock_type TEXT NOT NULL,
          unlock_value TEXT NOT NULL,
          is_unlocked INTEGER NOT NULL DEFAULT 0,
          created_by TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          unlocked_at TEXT
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS playlist_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          artist TEXT NOT NULL,
          url TEXT NOT NULL,
          description TEXT NOT NULL,
          mood TEXT NOT NULL,
          is_unlocked INTEGER NOT NULL DEFAULT 0,
          created_by TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          unlocked_at TEXT
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS discoveries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content_type TEXT NOT NULL,
          text_content TEXT NOT NULL,
          media_url TEXT,
          hint TEXT NOT NULL,
          unlock_keyword TEXT NOT NULL UNIQUE,
          is_unlocked INTEGER NOT NULL DEFAULT 0,
          created_by TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          unlocked_at TEXT
        )
      `);
    });

    return db;
  } catch (error) {
    console.error('[DB] Falha na inicialização do banco:', error);
    throw error;
  }
}

module.exports = { initDatabase };
