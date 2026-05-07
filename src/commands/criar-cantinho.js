const { SlashCommandBuilder } = require('discord.js');
const { canUseMainSystem } = require('../utils/accessControl');
const { buildCreateDiscoveryModal } = require('../systems/discoveries/discoveriesUI');

module.exports = {
  data: new SlashCommandBuilder().setName('criar-cantinho').setDescription('Cria um novo cantinho secreto.'),
  async execute(interaction) {
    try {
      if (!canUseMainSystem(interaction.user.id)) {
        await interaction.reply({ content: 'Apenas Nerissa e owner podem criar cantinhos.', ephemeral: true });
        return;
      }
      await interaction.showModal(buildCreateDiscoveryModal());
    } catch (error) {
      console.error('[CMD] erro /criar-cantinho', error);
      await interaction.reply({ content: 'Falha ao abrir criação de cantinho.', ephemeral: true });
    }
  }
};
