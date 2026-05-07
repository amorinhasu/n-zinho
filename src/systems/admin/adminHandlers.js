const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { canUseMainSystem, isOwner } = require('../../utils/accessControl');
const { buildNozinhoMainPanel } = require('../../commands/nozinho');
const { getLetterById, listLettersByUser, unlockLetterById, deleteLetterById } = require('../letters/lettersRepository');
const { listRecentDiscoveries, getDiscoveryById, deleteDiscoveryById } = require('../discoveries/discoveriesRepository');
const { createSecretKey, listSecretKeys, toggleSecretKey } = require('./secretKeysRepository');

function adminMainEmbed() {
  return new EmbedBuilder().setColor(0xfb7185).setTitle('Administração do Nózinho').setDescription('Painel privado para ajustar cartas, senhas e descobertas.');
}

function adminMainButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('admin:letters').setLabel('administrar cartas').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('admin:keys').setLabel('administrar senhas').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('admin:discoveries').setLabel('administrar descobertas').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('admin:back').setLabel('voltar').setStyle(ButtonStyle.Success)
  );
}

async function openAdminMainPanel(interaction, isReply = false) {
  const payload = { embeds: [adminMainEmbed()], components: [adminMainButtons()], ephemeral: true };
  if (isReply) return interaction.reply(payload);
  return interaction.update(payload);
}

function idModal(customId, title, label) {
  return new ModalBuilder().setCustomId(customId).setTitle(title).addComponents(
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('id').setLabel(label).setStyle(TextInputStyle.Short).setRequired(true))
  );
}

async function handleAdminButtons(interaction) {
  if (!canUseMainSystem(interaction.user.id)) return interaction.reply({ content: 'Acesso negado.', ephemeral: true });

  if (interaction.customId === 'admin:back') {
    const { introEmbed, row, secondaryRow } = buildNozinhoMainPanel();
    return interaction.update({ embeds: [introEmbed], components: [row, secondaryRow] });
  }
  if (interaction.customId === 'admin:letters') {
    const letters = await listLettersByUser(interaction.client.db, interaction.user.id, 8);
    const embed = new EmbedBuilder().setColor(0xfda4af).setTitle('Admin · Cartas').setDescription((letters.length ? letters : [{ id: '-', title: 'nenhuma', mood: '-', is_unlocked: 0 }]).map((l) => `#${l.id} · ${l.title} · ${l.mood} · ${l.is_unlocked ? 'liberada' : 'guardada'}`).join('\n'));
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('admin:letters:unlock').setLabel('liberar por ID').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('admin:letters:delete').setLabel('apagar por ID').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('admin:letters:view').setLabel('ver detalhes').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('admin:home').setLabel('voltar admin').setStyle(ButtonStyle.Success)
    );
    return interaction.update({ embeds: [embed], components: [row] });
  }
  if (interaction.customId === 'admin:keys') {
    const keys = await listSecretKeys(interaction.client.db, 8);
    const embed = new EmbedBuilder().setColor(0xc084fc).setTitle('Admin · Senhas').setDescription((keys.length ? keys : [{ id: '-', label: 'nenhuma', is_active: 0 }]).map((k) => `#${k.id} · ${k.label} · ${k.is_active ? 'ativa' : 'inativa'}`).join('\n'));
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('admin:keys:create').setLabel('criar senha').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('admin:keys:toggle').setLabel('ativar/desativar ID').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('admin:home').setLabel('voltar admin').setStyle(ButtonStyle.Success)
    );
    return interaction.update({ embeds: [embed], components: [row] });
  }
  if (interaction.customId === 'admin:discoveries') {
    const items = await listRecentDiscoveries(interaction.client.db, 8);
    const embed = new EmbedBuilder().setColor(0xa78bfa).setTitle('Admin · Descobertas').setDescription((items.length ? items : [{ id: '-', title: 'nenhuma', hint: '-', is_unlocked: 0 }]).map((d) => `#${d.id} · ${d.title} · ${d.is_unlocked ? 'liberada' : 'guardada'} · pista: ${d.hint}`).join('\n'));
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('admin:discoveries:view').setLabel('ver detalhes').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('admin:discoveries:delete').setLabel('apagar por ID').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('admin:home').setLabel('voltar admin').setStyle(ButtonStyle.Success)
    );
    return interaction.update({ embeds: [embed], components: [row] });
  }
  if (interaction.customId === 'admin:home') return openAdminMainPanel(interaction);
  if (interaction.customId === 'admin:letters:unlock') return interaction.showModal(idModal('admin:letters:unlock', 'Liberar carta', 'ID da carta'));
  if (interaction.customId === 'admin:letters:delete') return interaction.showModal(idModal('admin:letters:delete', 'Apagar carta', 'ID da carta'));
  if (interaction.customId === 'admin:letters:view') return interaction.showModal(idModal('admin:letters:view', 'Detalhes da carta', 'ID da carta'));
  if (interaction.customId === 'admin:discoveries:view') return interaction.showModal(idModal('admin:discoveries:view', 'Detalhes descoberta', 'ID da descoberta'));
  if (interaction.customId === 'admin:discoveries:delete') return interaction.showModal(idModal('admin:discoveries:delete', 'Apagar descoberta', 'ID da descoberta'));
  if (interaction.customId === 'admin:keys:toggle') return interaction.showModal(idModal('admin:keys:toggle', 'Ativar/desativar senha', 'ID da senha'));
  if (interaction.customId === 'admin:keys:create') {
    const modal = new ModalBuilder().setCustomId('admin:keys:create').setTitle('Criar senha secreta').addComponents(
      new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('label').setLabel('Rótulo').setStyle(TextInputStyle.Short).setRequired(true)),
      new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('keyword').setLabel('Palavra-chave').setStyle(TextInputStyle.Short).setRequired(true)),
      new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('description').setLabel('Descrição').setStyle(TextInputStyle.Paragraph).setRequired(false))
    );
    return interaction.showModal(modal);
  }
}

async function handleAdminModals(interaction) {
  if (!canUseMainSystem(interaction.user.id)) return interaction.reply({ content: 'Acesso negado.', ephemeral: true });
  const id = Number(interaction.fields.getTextInputValue('id'));
  if (interaction.customId === 'admin:letters:unlock') {
    const letter = await getLetterById(interaction.client.db, id);
    if (!letter) return interaction.reply({ content: 'Carta não encontrada.', ephemeral: true });
    await unlockLetterById(interaction.client.db, id);
    return interaction.reply({ content: `Carta #${id} liberada.`, ephemeral: true });
  }
  if (interaction.customId === 'admin:letters:delete') {
    await deleteLetterById(interaction.client.db, id);
    return interaction.reply({ content: `Carta #${id} apagada.`, ephemeral: true });
  }
  if (interaction.customId === 'admin:letters:view') {
    const letter = await getLetterById(interaction.client.db, id);
    if (!letter) return interaction.reply({ content: 'Carta não encontrada.', ephemeral: true });
    const embed = new EmbedBuilder().setColor(0xfbcfe8).setTitle(`Carta #${letter.id} · ${letter.title}`).setDescription(letter.body.slice(0, 1500)).addFields({ name: 'Sentimento', value: letter.mood }, { name: 'Status', value: letter.is_unlocked ? 'liberada' : 'guardada' });
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
  if (interaction.customId === 'admin:discoveries:view') {
    const d = await getDiscoveryById(interaction.client.db, id);
    if (!d) return interaction.reply({ content: 'Descoberta não encontrada.', ephemeral: true });
    return interaction.reply({ embeds: [new EmbedBuilder().setColor(0xe9d5ff).setTitle(`Descoberta #${d.id} · ${d.title}`).setDescription(d.text_content).addFields({ name: 'Pista', value: d.hint }, { name: 'Status', value: d.is_unlocked ? 'liberada' : 'guardada' })], ephemeral: true });
  }
  if (interaction.customId === 'admin:discoveries:delete') {
    await deleteDiscoveryById(interaction.client.db, id);
    return interaction.reply({ content: `Descoberta #${id} apagada.`, ephemeral: true });
  }
  if (interaction.customId === 'admin:keys:toggle') {
    const changes = await toggleSecretKey(interaction.client.db, id);
    return interaction.reply({ content: changes ? `Senha #${id} alternada.` : 'Senha não encontrada.', ephemeral: true });
  }
  if (interaction.customId === 'admin:keys:create') {
    const newId = await createSecretKey(interaction.client.db, {
      label: interaction.fields.getTextInputValue('label').trim(),
      keyword: interaction.fields.getTextInputValue('keyword').trim(),
      description: interaction.fields.getTextInputValue('description')?.trim() || '',
      createdBy: interaction.user.id
    });
    return interaction.reply({ content: `Senha criada com ID #${newId}.`, ephemeral: true });
  }
}

module.exports = { openAdminMainPanel, handleAdminButtons, handleAdminModals };
