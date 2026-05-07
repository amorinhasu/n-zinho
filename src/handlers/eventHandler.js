const fs = require('fs');
const path = require('path');

async function loadEvents(client) {
  try {
    const eventsPath = path.join(__dirname, '..', 'events');
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);

      if (!event.name || !event.execute) {
        console.warn(`[EVENT] Arquivo ignorado (inválido): ${file}`);
        continue;
      }

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }

    console.log(`[EVENT] ${eventFiles.length} evento(s) carregado(s).`);
  } catch (error) {
    console.error('[EVENT] Erro ao carregar eventos:', error);
    throw error;
  }
}

module.exports = { loadEvents };
