const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('../src/config');

async function registerCommands() {
  try {
    const commandsPath = path.join(__dirname, '..', 'src', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

    const commands = [];
    for (const file of commandFiles) {
      const command = require(path.join(commandsPath, file));
      if (command.data) {
        commands.push(command.data.toJSON());
      }
    }

    const rest = new REST({ version: '10' }).setToken(token);

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

    console.log(`[REGISTER] ${commands.length} slash command(s) registrados com sucesso.`);
  } catch (error) {
    console.error('[REGISTER] Erro ao registrar slash commands:', error);
    process.exit(1);
  }
}

registerCommands();
