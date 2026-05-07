const { EmbedBuilder } = require('discord.js');
const { canUseMainSystem, canRamielAccess } = require('../../utils/accessControl');
const { buildNozinhoMainPanel } = require('../../commands/nozinho');
const { buildDiscoveriesPanel, buildCreateDiscoveryModal, buildTryDiscoverModal } = require('./discoveriesUI');
const { createDiscovery, findByKeyword, unlockDiscoveryById, listUnlockedDiscoveries } = require('./discoveriesRepository');

function inferContentType(text, mediaUrl) {
  if (text && mediaUrl) return 'misto';
  if (mediaUrl && mediaUrl.toLowerCase().endsWith('.gif')) return 'gif';
  if (mediaUrl) return 'imagem';
  return 'texto';
}

async function openDiscoveriesPanel(interaction) {
  const { embed, row } = buildDiscoveriesPanel();
  await interaction.update({ embeds: [embed], components: [row] });
}

async function handleDiscoveriesButtons(interaction) {
  if (interaction.customId === 'discoveries:create') {
    if (!canUseMainSystem(interaction.user.id)) return interaction.reply({ content: 'Só Nerissa pode criar cantinhos. 💌', ephemeral: true });
    return interaction.showModal(buildCreateDiscoveryModal());
  }

  if (interaction.customId === 'discoveries:list') {
    if (!canRamielAccess(interaction.user.id)) return interaction.reply({ content: 'Você não pode ver esta área.', ephemeral: true });
    const rows = await listUnlockedDiscoveries(interaction.client.db, 5);
    if (!rows.length) return interaction.reply({ content: 'Ainda não existem descobertas liberadas. ✨', ephemeral: true });
    const embed = new EmbedBuilder().setColor(0xe879f9).setTitle('Descobertas já reveladas').setDescription(rows.map((d, i) => `${i + 1}. **${d.title}** · tipo: ${d.content_type} · liberado: ${d.unlocked_at || 'agora há pouco'}`).join('\n'));
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (interaction.customId === 'discoveries:try') {
    if (!canRamielAccess(interaction.user.id)) return interaction.reply({ content: 'Você não pode tentar descobrir agora.', ephemeral: true });
    return interaction.showModal(buildTryDiscoverModal());
  }

  if (interaction.customId === 'discoveries:back') {
    const { introEmbed, row, secondaryRow } = buildNozinhoMainPanel();
    return interaction.update({ embeds: [introEmbed], components: [row, secondaryRow] });
  }
}

async function handleCreateDiscoveryModal(interaction) {
  if (!canUseMainSystem(interaction.user.id)) return interaction.reply({ content: 'Só Nerissa e owner podem criar cantinhos.', ephemeral: true });

  const title = interaction.fields.getTextInputValue('title').trim();
  const textContent = interaction.fields.getTextInputValue('text_content').trim();
  const mediaUrl = interaction.fields.getTextInputValue('media_url')?.trim();
  const hint = interaction.fields.getTextInputValue('hint').trim();
  const unlockKeyword = interaction.fields.getTextInputValue('unlock_keyword').trim();

  const contentType = inferContentType(textContent, mediaUrl);
  const result = await createDiscovery(interaction.client.db, { title, textContent, mediaUrl: mediaUrl || null, hint, unlockKeyword, contentType, createdBy: interaction.user.id });
  await interaction.reply({ content: `Cantinho #${result.id} guardado com carinho.`, ephemeral: true });
}

async function processDiscoveryKeyword(interaction, keyword) {
  if (!canRamielAccess(interaction.user.id)) return interaction.reply({ content: 'Você não pode usar esse sistema.', ephemeral: true });
  const discovery = await findByKeyword(interaction.client.db, keyword.trim());
  if (!discovery) return interaction.reply({ content: 'O silêncio respondeu... talvez a pista ainda não esteja completa. 🌙', ephemeral: true });

  await unlockDiscoveryById(interaction.client.db, discovery.id);
  const embed = new EmbedBuilder()
    .setColor(0xf0abfc)
    .setTitle(`Você encontrou: ${discovery.title}`)
    .setDescription(`Uma lembrança escondida foi revelada para você.\n\n${discovery.text_content}`)
    .addFields({ name: 'Pista', value: discovery.hint || 'sem pista' });

  if (discovery.media_url) embed.setImage(discovery.media_url);

  const payload = { embeds: [embed], ephemeral: true };
  if (interaction.isModalSubmit() || interaction.isChatInputCommand()) return interaction.reply(payload);
  return interaction.followUp(payload);
}

module.exports = { openDiscoveriesPanel, handleDiscoveriesButtons, handleCreateDiscoveryModal, processDiscoveryKeyword };
