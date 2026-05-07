function isSecretUnlocked(db, userId) {
  return new Promise((resolve, reject) => {
    try {
      db.get(
        'SELECT id FROM unlocks WHERE discord_user_id = ? AND key = ? LIMIT 1',
        [userId, 'secret_area'],
        (error, row) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(Boolean(row));
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

function unlockSecretArea(db, userId) {
  return new Promise((resolve, reject) => {
    try {
      db.run(
        'INSERT OR IGNORE INTO unlocks (discord_user_id, key) VALUES (?, ?)',
        [userId, 'secret_area'],
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(true);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  isSecretUnlocked,
  unlockSecretArea
};
