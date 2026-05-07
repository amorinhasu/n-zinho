function createLetter(db, payload) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        INSERT INTO letters (
          title,
          body,
          mood,
          unlock_type,
          unlock_value,
          is_unlocked,
          created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        payload.title,
        payload.body,
        payload.mood,
        payload.unlockType,
        payload.unlockValue,
        0,
        payload.createdBy
      ];

      db.run(sql, values, function onInsert(error) {
        if (error) {
          reject(error);
          return;
        }
        resolve(this.lastID);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function listLettersByUser(db, userId, limit = 5) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        SELECT id, title, mood, is_unlocked, created_at
        FROM letters
        WHERE created_by = ?
        ORDER BY id DESC
        LIMIT ?
      `;

      db.all(sql, [userId, limit], (error, rows) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(rows || []);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function listUnlockedLettersByUser(db, userId, limit = 5) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
        SELECT id, title, mood, unlocked_at
        FROM letters
        WHERE created_by = ? AND is_unlocked = 1
        ORDER BY unlocked_at DESC, id DESC
        LIMIT ?
      `;

      db.all(sql, [userId, limit], (error, rows) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(rows || []);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getLetterById(db, id) {
  return new Promise((resolve, reject) => {
    try {
      db.get(
        'SELECT * FROM letters WHERE id = ?',
        [id],
        (error, row) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(row || null);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

function unlockLetterById(db, id) {
  return new Promise((resolve, reject) => {
    try {
      db.run(
        'UPDATE letters SET is_unlocked = 1, unlocked_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id],
        function onUpdate(error) {
          if (error) {
            reject(error);
            return;
          }
          resolve(this.changes || 0);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  createLetter,
  listLettersByUser,
  listUnlockedLettersByUser,
  getLetterById,
  unlockLetterById
};
