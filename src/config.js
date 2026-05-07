const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const requiredEnv = [
  'DISCORD_TOKEN',
  'CLIENT_ID',
  'GUILD_ID',
  'OWNER_ID',
  'TARGET_USER_ID',
  'LOVE_ID',
  'SECRET_PASSWORD'
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente ausente: ${key}`);
  }
}

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  ownerId: process.env.OWNER_ID,
  targetUserId: process.env.TARGET_USER_ID,
  loveId: process.env.LOVE_ID,
  secretPassword: process.env.SECRET_PASSWORD,
  databasePath: path.join(__dirname, '..', 'data', 'nozinho.sqlite')
};
