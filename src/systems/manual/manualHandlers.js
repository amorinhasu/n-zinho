const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { canUseMainSystem, canRamielAccess } = require('../../utils/accessControl');
const { buildNozinhoMainPanel } = require('../../commands/nozinho');

function buildManualPanel() {
  const embed = new EmbedBuilder().setColor(0xf9a8d4).setTitle('Manuais do Nózinho').setDescription('Escolha qual manual deseja abrir.');
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('manual:nerissa').setLabel('manual da Nerissa').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('manual:ramiel').setLabel('manual do Ramiel').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('manual:back').setLabel('voltar').setStyle(ButtonStyle.Secondary)
  );
  return { embed, row };
}

async function openManualPanel(interaction) {
  const { embed, row } = buildManualPanel();
  await interaction.update({ embeds: [embed], components: [row] });
}

async function handleManualButtons(interaction) {
  if (interaction.customId === 'manual:nerissa') {
    if (!canUseMainSystem(interaction.user.id)) return interaction.reply({ content: 'Manual restrito.', ephemeral: true });
    const embed = new EmbedBuilder().setColor(0xf472b6).setTitle('Manual da Nerissa').setDescription('Use /nozinho para abrir o painel.\nCrie cartinhas, músicas e cantinhos com pistas.\nUse /segredo para abrir áreas ocultas.\nAlgumas partes exigem senha e desbloqueios.').setImage('https://i.pinimg.com/originals/4a/4a/86/4a4a86d520abe35d1204f7768869e63b.gif');
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
  if (interaction.customId === 'manual:ramiel') {
    if (!canRamielAccess(interaction.user.id)) return interaction.reply({ content: 'Manual restrito.', ephemeral: true });
    const embed = new EmbedBuilder().setColor(0xa78bfa).setTitle('Manual do Ramiel').setDescription('O Nózinho é um cofre emocional da Nerissa.\nExplore pistas, tente palavras e desbloqueie partes aos poucos.\nCartas e músicas podem aparecer gradualmente.').setImage('https://i.pinimg.com/originals/ff/92/46/ff9246b40bfa0b00721cc1b8b887fad2.gif');
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
  if (interaction.customId === 'manual:back') {
    const { introEmbed, row, secondaryRow } = buildNozinhoMainPanel();
    return interaction.update({ embeds: [introEmbed], components: [row, secondaryRow] });
  }
}

module.exports = { openManualPanel, handleManualButtons };
