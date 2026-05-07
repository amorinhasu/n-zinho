const { SlashCommandBuilder } = require('discord.js');
const { isOwner } = require('../utils/accessControl');
const {
  getPlaylistEntryById,
  unlockPlaylistEntryById
} = require('../systems/playlist/playlistRepository');
const { sendOwnerLog } = require('../systems/notifications/ownerLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('liberar-musica')
    .setDescription('Libera manualmente uma música da playlist pelo ID.')
    .addIntegerOption((option) => option
      .setName('id')
      .setDescription('ID da música que será liberada')
      .setRequired(true)),

  async execute(interaction) {
    try {
      if (!isOwner(interaction.user.id)) {
        await interaction.reply({
          content: 'Somente o dono do Nózinho pode liberar músicas. 🔐',
          ephemeral: true
        });
        return;
      }

      const id = interaction.options.getInteger('id', true);
      const music = await getPlaylistEntryById(interaction.client.db, id);

      if (!music) {
        await interaction.reply({
          content: `Não encontrei nenhuma música com ID **${id}**.`,
          ephemeral: true
        });
        return;
      }

      if (music.is_unlocked) {
        await interaction.reply({
          content: `A música **#${id}** já estava liberada.`,
          ephemeral: true
        });
        return;
      }

      await unlockPlaylistEntryById(interaction.client.db, id);

      const unlockMessages = [
        `Música **#${id}** liberada com sucesso na playlist do Nózinho. ✨`,
        `A faixa **#${id}** foi liberada. Que ela embale um momento bem fofinho. 🎧💗`,
        `Pronto! A música **#${id}** já pode tocar no cantinho de vocês. 🌸🤍`
      ];

      await interaction.reply({
        content: unlockMessages[Math.floor(Math.random() * unlockMessages.length)],
        ephemeral: true
      });

      await sendOwnerLog(interaction.client, { action: 'Música liberada manualmente', userTag: interaction.user.tag, userId: interaction.user.id, detail: `Música #${id}` });
    } catch (error) {
      console.error('[CMD] Erro no comando /liberar-musica:', error);
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: 'Não consegui liberar a música agora. Tente novamente.',
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: 'Não consegui liberar a música agora. Tente novamente.',
          ephemeral: true
        });
      }
    }
  }
};
