const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

function buildDiscoveriesPanel() {
  const embed = new EmbedBuilder()
    .setColor(0xc084fc)
    .setTitle('Descobertas & Cantinhos')
    .setDescription('Cada pista pode revelar uma memória, uma imagem ou uma música escondida.');

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('discoveries:create').setLabel('criar cantinho').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('discoveries:list').setLabel('minhas descobertas').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('discoveries:try').setLabel('tentar descobrir').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('discoveries:back').setLabel('voltar').setStyle(ButtonStyle.Secondary)
  );

  return { embed, row };
}

function buildCreateDiscoveryModal() {
  const modal = new ModalBuilder().setCustomId('discoveries:create').setTitle('Criar cantinho secreto');
  modal.addComponents(
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('title').setLabel('Título').setStyle(TextInputStyle.Short).setRequired(true)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('text_content').setLabel('Texto/conteúdo').setStyle(TextInputStyle.Paragraph).setRequired(true)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('media_url').setLabel('URL de imagem ou GIF').setStyle(TextInputStyle.Short).setRequired(false)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('hint').setLabel('Pista').setStyle(TextInputStyle.Short).setRequired(true)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('unlock_keyword').setLabel('Palavra-chave de desbloqueio').setStyle(TextInputStyle.Short).setRequired(true))
  );
  return modal;
}

function buildTryDiscoverModal() {
  const modal = new ModalBuilder().setCustomId('discoveries:try').setTitle('Tentar descobrir');
  modal.addComponents(
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('keyword').setLabel('Palavra-chave').setStyle(TextInputStyle.Short).setRequired(true))
  );
  return modal;
}

module.exports = { buildDiscoveriesPanel, buildCreateDiscoveryModal, buildTryDiscoverModal };
