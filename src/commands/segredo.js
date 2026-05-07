const { SlashCommandBuilder } = require('discord.js');
const { canUseMainSystem } = require('../utils/accessControl');
const { secretPassword } = require('../config');
const { unlockSecretArea } = require('../systems/secrets/secretsRepository');
const { openSecretPanelReply } = require('../systems/secrets/secretsHandlers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('segredo')
    .setDescription('Tenta acessar a área secreta do Nózinho.')
    .addStringOption((option) => option
      .setName('senha')
      .setDescription('A palavra que abre o caminho oculto')
      .setRequired(true)),

  async execute(interaction) {
    try {
      if (!canUseMainSystem(interaction.user.id)) {
        await interaction.reply({
          content: 'Este caminho não responde para você. 💌',
          ephemeral: true
        });
        return;
      }

      const senha = interaction.options.getString('senha', true);

      if (senha !== secretPassword) {
        await interaction.reply({
          content: 'As sombras sussurram, mas a porta ainda não reconheceu seu toque. 🌫️',
          ephemeral: true
        });
        return;
      }

      await unlockSecretArea(interaction.client.db, interaction.user.id);
      await openSecretPanelReply(interaction);
    } catch (error) {
      console.error('[CMD] Erro no comando /segredo:', error);
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: 'Não foi possível acessar a área secreta agora.',
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: 'Não foi possível acessar a área secreta agora.',
          ephemeral: true
        });
      }
    }
  }
};
