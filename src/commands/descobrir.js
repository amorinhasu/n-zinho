const { SlashCommandBuilder } = require('discord.js');
const { canRamielAccess } = require('../utils/accessControl');
const { processDiscoveryKeyword } = require('../systems/discoveries/discoveriesHandlers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('descobrir')
    .setDescription('Tente uma palavra-chave para descobrir algo escondido.')
    .addStringOption((option) => option.setName('palavra').setDescription('Palavra-chave').setRequired(true)),
  async execute(interaction) {
    try {
      if (!canRamielAccess(interaction.user.id)) {
        await interaction.reply({ content: 'Este comando não é para você.', ephemeral: true });
        return;
      }
      const keyword = interaction.options.getString('palavra', true);
      await processDiscoveryKeyword(interaction, keyword);
    } catch (error) {
      console.error('[CMD] erro /descobrir', error);
      await interaction.reply({ content: 'Não consegui processar sua descoberta agora.', ephemeral: true });
    }
  }
};
