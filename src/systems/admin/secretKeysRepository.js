function createSecretKey(db, payload) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO secret_keys (label, keyword, description, is_active, created_by) VALUES (?, ?, ?, 1, ?)',
      [payload.label, payload.keyword.toLowerCase(), payload.description, payload.createdBy],
      function onInsert(error) {
        if (error) return reject(error);
        resolve(this.lastID);
      }
    );
  });
}

function listSecretKeys(db, limit = 10) {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, label, keyword, description, is_active, created_at FROM secret_keys ORDER BY id DESC LIMIT ?', [limit], (e, rows) => (e ? reject(e) : resolve(rows || [])));
  });
}

function toggleSecretKey(db, id) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE secret_keys SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE id = ?', [id], function onUpdate(error) {
      if (error) return reject(error);
      resolve(this.changes || 0);
    });
  });
}

module.exports = { createSecretKey, listSecretKeys, toggleSecretKey };
