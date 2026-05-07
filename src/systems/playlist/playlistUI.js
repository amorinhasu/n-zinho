const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');

function buildPlaylistPanelEmbed() {
  return new EmbedBuilder()
    .setColor(0x22c55e)
    .setTitle('Playlist do Nózinho 🎧🧸')
    .setDescription('Uma vitrolinha de sentimentos: canções que brilham como memórias vivas. ✨')
    .setFooter({ text: 'Cada música toca um pedacinho do coração. ୨ৎ' })
    .setTimestamp();
}

function buildPlaylistPanelButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('playlist:add').setLabel('adicionar música').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('playlist:unlocked').setLabel('músicas liberadas').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('playlist:random').setLabel('música aleatória').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('playlist:back').setLabel('voltar').setStyle(ButtonStyle.Success)
  );
}

function buildAddMusicModal() {
  const modal = new ModalBuilder().setCustomId('playlist:create').setTitle('Adicionar música');

  const titleInput = new TextInputBuilder().setCustomId('title').setLabel('Nome da música').setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(120);
  const artistInput = new TextInputBuilder().setCustomId('artist').setLabel('Artista').setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(120);
  const urlInput = new TextInputBuilder().setCustomId('url').setLabel('Link').setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(300);
  const descriptionInput = new TextInputBuilder().setCustomId('description').setLabel('Significado / descrição').setStyle(TextInputStyle.Paragraph).setRequired(true).setMaxLength(1000);
  const moodInput = new TextInputBuilder().setCustomId('mood').setLabel('Sentimento').setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(80);

  modal.addComponents(
    new ActionRowBuilder().addComponents(titleInput),
    new ActionRowBuilder().addComponents(artistInput),
    new ActionRowBuilder().addComponents(urlInput),
    new ActionRowBuilder().addComponents(descriptionInput),
    new ActionRowBuilder().addComponents(moodInput)
  );

  return modal;
}

module.exports = { buildPlaylistPanelEmbed, buildPlaylistPanelButtons, buildAddMusicModal };
