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
const {
  openDiscoveriesPanel,
  handleDiscoveriesButtons,
  handleCreateDiscoveryModal,
  processDiscoveryKeyword
} = require('../systems/discoveries/discoveriesHandlers');
const { openManualPanel, handleManualButtons } = require('../systems/manual/manualHandlers');

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
        if (interaction.customId === 'nozinho:letters') {
          if (!canUseMainSystem(interaction.user.id)) return interaction.reply({ content: 'Este painel é reservado para a Nerissa. 💌', ephemeral: true });
          await openLettersPanel(interaction);
          return;
        }

        if (interaction.customId === 'nozinho:playlist') {
          if (!canUseMainSystem(interaction.user.id)) return interaction.reply({ content: 'Este painel é reservado para a Nerissa. 💌', ephemeral: true });
          await openPlaylistPanel(interaction);
          return;
        }
        if (interaction.customId === 'nozinho:discoveries') {
          await openDiscoveriesPanel(interaction);
          return;
        }
        if (interaction.customId === 'nozinho:manual') {
          await openManualPanel(interaction);
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
        if (interaction.customId.startsWith('discoveries:')) {
          await handleDiscoveriesButtons(interaction);
          return;
        }
        if (interaction.customId.startsWith('manual:')) {
          await handleManualButtons(interaction);
          return;
        }

        await interaction.reply({
          content: 'Esta seção ainda está em construção nesta fase inicial. ✨',
          ephemeral: true
        });
        return;
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'letters:create') {
          if (!canUseMainSystem(interaction.user.id)) return interaction.reply({ content: 'Este sistema é reservado para a Nerissa. 💌', ephemeral: true });
          await handleLetterModalSubmit(interaction);
          return;
        }

        if (interaction.customId === 'playlist:create') {
          if (!canUseMainSystem(interaction.user.id)) return interaction.reply({ content: 'Este sistema é reservado para a Nerissa. 💌', ephemeral: true });
          await handlePlaylistModalSubmit(interaction);
          return;
        }

        if (interaction.customId === 'discoveries:create') {
          await handleCreateDiscoveryModal(interaction);
          return;
        }

        if (interaction.customId === 'discoveries:try') {
          const keyword = interaction.fields.getTextInputValue('keyword');
          await processDiscoveryKeyword(interaction, keyword);
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
