const { SlashCommandBuilder } = require('discord.js');
const { isOwner } = require('../utils/accessControl');
const {
  getLetterById,
  unlockLetterById
} = require('../systems/letters/lettersRepository');
const { sendOwnerLog } = require('../systems/notifications/ownerLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('liberar-carta')
    .setDescription('Libera manualmente uma cartinha pelo ID.')
    .addIntegerOption((option) => option
      .setName('id')
      .setDescription('ID da carta que será liberada')
      .setRequired(true)),

  async execute(interaction) {
    try {
      if (!isOwner(interaction.user.id)) {
        await interaction.reply({
          content: 'Somente o dono do Nózinho pode liberar cartinhas. 🔐',
          ephemeral: true
        });
        return;
      }

      const id = interaction.options.getInteger('id', true);
      const letter = await getLetterById(interaction.client.db, id);

      if (!letter) {
        await interaction.reply({
          content: `Não encontrei nenhuma cartinha com ID **${id}**.`,
          ephemeral: true
        });
        return;
      }

      if (letter.is_unlocked) {
        await interaction.reply({
          content: `A cartinha **#${id}** já estava liberada.`,
          ephemeral: true
        });
        return;
      }

      await unlockLetterById(interaction.client.db, id);

      await interaction.reply({
        content: `Cartinha **#${id}** liberada com sucesso no baú do Nózinho. ✨`,
        ephemeral: true
      });

      await sendOwnerLog(interaction.client, { action: 'Carta liberada manualmente', userTag: interaction.user.tag, userId: interaction.user.id, detail: `Carta #${id}` });
    } catch (error) {
      console.error('[CMD] Erro no comando /liberar-carta:', error);

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: 'Não consegui liberar a cartinha agora. Tente novamente.',
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: 'Não consegui liberar a cartinha agora. Tente novamente.',
          ephemeral: true
        });
      }
    }
  }
};
