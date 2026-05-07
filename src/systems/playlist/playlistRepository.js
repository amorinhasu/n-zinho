function createPlaylistEntry(db, payload) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        INSERT INTO playlist_entries (
          title,
          artist,
          url,
          description,
          mood,
          is_unlocked,
          created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(
        sql,
        [
          payload.title,
          payload.artist,
          payload.url,
          payload.description,
          payload.mood,
          0,
          payload.createdBy
        ],
        function onInsert(error) {
          if (error) return reject(error);
          resolve(this.lastID);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

function listUnlockedPlaylistEntriesByUser(db, userId, limit = 5) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        SELECT id, title, artist, mood, unlocked_at
        FROM playlist_entries
        WHERE created_by = ? AND is_unlocked = 1
        ORDER BY unlocked_at DESC, id DESC
        LIMIT ?
      `;

      db.all(sql, [userId, limit], (error, rows) => {
        if (error) return reject(error);
        resolve(rows || []);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getPlaylistEntryById(db, id) {
  return new Promise((resolve, reject) => {
    try {
      db.get('SELECT * FROM playlist_entries WHERE id = ?', [id], (error, row) => {
        if (error) return reject(error);
        resolve(row || null);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function unlockPlaylistEntryById(db, id) {
  return new Promise((resolve, reject) => {
    try {
      db.run(
        'UPDATE playlist_entries SET is_unlocked = 1, unlocked_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id],
        function onUpdate(error) {
          if (error) return reject(error);
          resolve(this.changes || 0);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

function getRandomUnlockedPlaylistEntryByUser(db, userId) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        SELECT *
        FROM playlist_entries
        WHERE created_by = ? AND is_unlocked = 1
        ORDER BY RANDOM()
        LIMIT 1
      `;

      db.get(sql, [userId], (error, row) => {
        if (error) return reject(error);
        resolve(row || null);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  createPlaylistEntry,
  listUnlockedPlaylistEntriesByUser,
  getPlaylistEntryById,
  unlockPlaylistEntryById,
  getRandomUnlockedPlaylistEntryByUser
};
