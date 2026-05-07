const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

function buildSecretEmbed() {
  return new EmbedBuilder()
    .setColor(0x7c3aed)
    .setTitle('Área Secreta ✨')
    .setDescription('Você encontrou a passagem escondida. Aqui moram detalhes que o coração guarda em silêncio.')
    .setFooter({ text: 'Nózinho · confidencial' })
    .setTimestamp();
}

function buildSecretButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('secret:chest').setLabel('abrir baú secreto').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('secret:hint').setLabel('ouvir uma pista').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('secret:back').setLabel('voltar ao nózinho').setStyle(ButtonStyle.Success)
  );
}

module.exports = { buildSecretEmbed, buildSecretButtons };
