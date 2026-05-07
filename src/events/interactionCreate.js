const { canUseMainSystem } = require('../utils/accessControl');
const {
  openLettersPanel,
  handleLettersButtons,
  handleLetterModalSubmit
} = require('../systems/letters/lettersHandlers');
const {
  openSecretPanelUpdate,
  handleSecretButtons
} = require('../systems/secrets/secretsHandlers');
const { isSecretUnlocked } = require('../systems/secrets/secretsRepository');
const {
  openPlaylistPanel,
  handlePlaylistButtons,
  handlePlaylistModalSubmit
} = require('../systems/playlist/playlistHandlers');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
          await interaction.reply({
            content: 'Comando não encontrado.',
            ephemeral: true
          });
          return;
        }

        await command.execute(interaction);
        return;
      }

      if (interaction.isButton()) {
        if (!canUseMainSystem(interaction.user.id)) {
          await interaction.reply({
            content: 'Este painel é reservado para a Nerissa. 💌',
            ephemeral: true
          });
          return;
        }

        if (interaction.customId === 'nozinho:letters') {
          await openLettersPanel(interaction);
          return;
        }

        if (interaction.customId === 'nozinho:playlist') {
          await openPlaylistPanel(interaction);
          return;
        }

        if (interaction.customId === 'nozinho:secret') {
          const unlocked = await isSecretUnlocked(interaction.client.db, interaction.user.id);
          if (!unlocked) {
            await interaction.reply({
              content: 'tem coisas que só aparecem quando a palavra certa encontra a pessoa certa.',
              ephemeral: true
            });
            return;
          }

          await openSecretPanelUpdate(interaction);
          return;
        }

        if (interaction.customId.startsWith('letters:')) {
          await handleLettersButtons(interaction);
          return;
        }

        if (interaction.customId.startsWith('playlist:')) {
          await handlePlaylistButtons(interaction);
          return;
        }

        if (interaction.customId.startsWith('secret:')) {
          await handleSecretButtons(interaction);
          return;
        }

        await interaction.reply({
          content: 'Esta seção ainda está em construção nesta fase inicial. ✨',
          ephemeral: true
        });
        return;
      }

      if (interaction.isModalSubmit()) {
        if (!canUseMainSystem(interaction.user.id)) {
          await interaction.reply({
            content: 'Este sistema é reservado para a Nerissa. 💌',
            ephemeral: true
          });
          return;
        }

        if (interaction.customId === 'letters:create') {
          await handleLetterModalSubmit(interaction);
          return;
        }

        if (interaction.customId === 'playlist:create') {
          await handlePlaylistModalSubmit(interaction);
        }
      }
    } catch (error) {
      console.error('[EVENT] Erro no interactionCreate:', error);

      if (interaction.isRepliable()) {
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp({
            content: 'Ocorreu um erro interno. Tente novamente.',
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: 'Ocorreu um erro interno. Tente novamente.',
            ephemeral: true
          });
        }
      }
    }
  }
};
