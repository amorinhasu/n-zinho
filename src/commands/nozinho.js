const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const { canUseMainSystem } = require('../utils/accessControl');

function buildNozinhoMainPanel() {
  const introEmbed = new EmbedBuilder()
    .setColor(0xf472b6)
    .setTitle('Nózinho ✨')
    .setDescription(
      'Um cantinho íntimo para Nerissa e Ramiel.\n\n'
      + 'Aqui cada clique é uma lembrança, um passo e uma descoberta. 💗'
    )
    .setFooter({ text: 'Feito com carinho para uma história única.' })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('nozinho:start')
      .setLabel('começar')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('nozinho:letters')
      .setLabel('cartinhas')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('nozinho:playlist')
      .setLabel('playlist')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('nozinho:continue')
      .setLabel('continuar')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('nozinho:secret')
      .setLabel('?')
      .setStyle(ButtonStyle.Secondary)
  );

  return { introEmbed, row };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nozinho')
    .setDescription('Abre o painel inicial do Nózinho.'),

  buildNozinhoMainPanel,

  async execute(interaction) {
    try {
      if (!canUseMainSystem(interaction.user.id)) {
        await interaction.reply({
          content: 'Este presente foi criado para uma pessoa especial. 💌',
          ephemeral: true
        });
        return;
      }

      const { introEmbed, row } = buildNozinhoMainPanel();

      await interaction.reply({
        embeds: [introEmbed],
        components: [row],
        ephemeral: true
      });
    } catch (error) {
      console.error('[CMD] Erro no comando /nozinho:', error);

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: 'Algo deu errado ao abrir o painel. Tente novamente em instantes.',
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: 'Algo deu errado ao abrir o painel. Tente novamente em instantes.',
          ephemeral: true
        });
      }
    }
  }
};
