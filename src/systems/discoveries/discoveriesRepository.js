function createDiscovery(db, data) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO discoveries (title, content_type, text_content, media_url, hint, unlock_keyword, is_unlocked, created_by)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?)
    `;

    db.run(
      sql,
      [data.title, data.contentType, data.textContent, data.mediaUrl, data.hint, data.unlockKeyword.toLowerCase(), data.createdBy],
      function onInsert(error) {
        if (error) return reject(error);
        resolve({ id: this.lastID });
      }
    );
  });
}

function findByKeyword(db, keyword) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM discoveries WHERE lower(unlock_keyword) = lower(?) LIMIT 1',
      [keyword],
      (error, row) => (error ? reject(error) : resolve(row || null))
    );
  });
}

function unlockDiscoveryById(db, id) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE discoveries SET is_unlocked = 1, unlocked_at = CURRENT_TIMESTAMP WHERE id = ? AND is_unlocked = 0',
      [id],
      function onUpdate(error) {
        if (error) return reject(error);
        resolve(this.changes > 0);
      }
    );
  });
}

function listUnlockedDiscoveries(db, limit = 5) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT id, title, content_type, hint, unlocked_at FROM discoveries WHERE is_unlocked = 1 ORDER BY datetime(unlocked_at) DESC LIMIT ?',
      [limit],
      (error, rows) => (error ? reject(error) : resolve(rows || []))
    );
  });
}

module.exports = { createDiscovery, findByKeyword, unlockDiscoveryById, listUnlockedDiscoveries };
