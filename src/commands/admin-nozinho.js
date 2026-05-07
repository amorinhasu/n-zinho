const { SlashCommandBuilder } = require('discord.js');
const { canUseMainSystem } = require('../utils/accessControl');
const { openAdminMainPanel } = require('../systems/admin/adminHandlers');
const { sendOwnerLog } = require('../systems/notifications/ownerLog');

module.exports = {
  data: new SlashCommandBuilder().setName('admin-nozinho').setDescription('Abre o painel administrativo do Nózinho.'),
  async execute(interaction) {
    try {
      if (!canUseMainSystem(interaction.user.id)) {
        await sendOwnerLog(interaction.client, {
          action: 'Tentativa sem permissão no /admin-nozinho',
          userTag: interaction.user.tag,
          userId: interaction.user.id
        });
        await interaction.reply({ content: 'Esse painel é secreto e restrito. 🔒', ephemeral: true });
        return;
      }

      await openAdminMainPanel(interaction, true);
    } catch (error) {
      console.error('[CMD] erro /admin-nozinho:', error);
      await interaction.reply({ content: 'Não consegui abrir o painel admin agora.', ephemeral: true });
    }
  }
};
