const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');

function buildLettersPanelEmbed() {
  return new EmbedBuilder()
    .setColor(0xfb7185)
    .setTitle('Cartinhas do Nózinho 💌')
    .setDescription('Escreva, guarde e releia pedaços da sua história com carinho.')
    .setFooter({ text: 'As cartinhas ficam seguras no baú do Nózinho.' })
    .setTimestamp();
}

function buildLettersPanelButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('letters:write')
      .setLabel('escrever cartinha')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('letters:list')
      .setLabel('minhas cartinhas')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('letters:unlocked')
      .setLabel('cartas liberadas')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('letters:back')
      .setLabel('voltar')
      .setStyle(ButtonStyle.Success)
  );
}

function buildWriteLetterModal() {
  const modal = new ModalBuilder()
    .setCustomId('letters:create')
    .setTitle('Escrever cartinha');

  const titleInput = new TextInputBuilder()
    .setCustomId('title')
    .setLabel('Título')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(100);

  const bodyInput = new TextInputBuilder()
    .setCustomId('body')
    .setLabel('Texto da carta')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(2000);

  const moodInput = new TextInputBuilder()
    .setCustomId('mood')
    .setLabel('Sentimento')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(60);

  const unlockTypeInput = new TextInputBuilder()
    .setCustomId('unlock_type')
    .setLabel('Tipo de desbloqueio (ex.: date, keyword)')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(40);

  const unlockValueInput = new TextInputBuilder()
    .setCustomId('unlock_value')
    .setLabel('Valor do desbloqueio')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(120);

  modal.addComponents(
    new ActionRowBuilder().addComponents(titleInput),
    new ActionRowBuilder().addComponents(bodyInput),
    new ActionRowBuilder().addComponents(moodInput),
    new ActionRowBuilder().addComponents(unlockTypeInput),
    new ActionRowBuilder().addComponents(unlockValueInput)
  );

  return modal;
}

module.exports = {
  buildLettersPanelEmbed,
  buildLettersPanelButtons,
  buildWriteLetterModal
};
