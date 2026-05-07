const fs = require('fs');
const path = require('path');

async function loadCommands(client) {
  try {
    client.commands.clear();

    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if (!command.data || !command.execute) {
        console.warn(`[CMD] Arquivo ignorado (inválido): ${file}`);
        continue;
      }

      client.commands.set(command.data.name, command);
    }

    console.log(`[CMD] ${client.commands.size} comando(s) carregado(s).`);
  } catch (error) {
    console.error('[CMD] Erro ao carregar comandos:', error);
    throw error;
  }
}

module.exports = { loadCommands };
