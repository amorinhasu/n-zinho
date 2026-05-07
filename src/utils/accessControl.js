const { ownerId, targetUserId, loveId } = require('../config');

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
  canUseMainSystem,
  canRamielAccess(userId) {
    try {
      return userId === loveId || canUseMainSystem(userId);
    } catch (error) {
      console.error('[ACCESS] Erro ao validar acesso do Ramiel:', error);
      return false;
    }
  }
};
