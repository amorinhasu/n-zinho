const { ownerId, targetUserId } = require('../config');

function isOwner(userId) {
  try {
    return userId === ownerId;
  } catch (error) {
    console.error('[ACCESS] Erro ao validar owner:', error);
    return false;
  }
}

function canUseMainSystem(userId) {
  try {
    return userId === targetUserId || isOwner(userId);
  } catch (error) {
    console.error('[ACCESS] Erro ao validar permissões principais:', error);
    return false;
  }
}

module.exports = {
  isOwner,
  canUseMainSystem
};
