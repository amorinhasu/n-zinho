const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const { initDatabase } = require('./database/sqlite');

async function bootstrap() {
  try {
    const client = new Client({
      intents: [GatewayIntentBits.Guilds],
      partials: [Partials.Channel]
    });

    client.commands = new Collection();
    client.db = initDatabase();

    await loadCommands(client);
    await loadEvents(client);

    await client.login(token);
  } catch (error) {
    console.error('[BOOT] Falha ao iniciar o bot:', error);
    process.exit(1);
  }
}

bootstrap();
