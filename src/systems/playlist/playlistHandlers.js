const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { buildNozinhoMainPanel } = require('../../commands/nozinho');
const { buildAddMusicModal, buildPlaylistPanelButtons, buildPlaylistPanelEmbed } = require('./playlistUI');
const {
  createPlaylistEntry,
  listUnlockedPlaylistEntriesByUser,
  getPlaylistEntryById,
  getRandomUnlockedPlaylistEntryByUser
} = require('./playlistRepository');

async function openPlaylistPanel(interaction) {
  try {
    await interaction.update({
      embeds: [buildPlaylistPanelEmbed()],
      components: [buildPlaylistPanelButtons()]
    });
  } catch (error) {
    console.error('[PLAYLIST] Erro ao abrir painel:', error);
    throw error;
  }
}

function musicDetailsEmbed(entry) {
  return new EmbedBuilder()
    .setColor(0x4ade80)
    .setTitle(entry.title)
    .addFields(
      { name: 'Artista', value: entry.artist },
      { name: 'Sentimento', value: entry.mood },
      { name: 'Significado', value: entry.description },
      { name: 'Link', value: entry.url },
      { name: 'Cadastrada em', value: entry.created_at || 'sem registro' }
    )
    .setFooter({ text: `Música #${entry.id}` })
    .setTimestamp();
}

async function handlePlaylistButtons(interaction) {
  try {
    if (interaction.customId === 'playlist:add') {
      await interaction.showModal(buildAddMusicModal());
      return;
    }

    if (interaction.customId === 'playlist:unlocked') {
      const rows = await listUnlockedPlaylistEntriesByUser(interaction.client.db, interaction.user.id, 5);
      if (!rows.length) {
        await interaction.reply({ content: 'Ainda não há músicas liberadas para você. 🎶', ephemeral: true });
        return;
      }

      const lines = rows.map((song, i) => `${i + 1}. **${song.title}** · ${song.artist} · *${song.mood}*`);
      const embed = new EmbedBuilder()
        .setColor(0x86efac)
        .setTitle('Músicas liberadas')
        .setDescription(lines.join('\n'))
        .setFooter({ text: 'Mostrando até 5 músicas liberadas.' })
        .setTimestamp();

      const buttonRows = rows.map((song) => new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`playlist:listen:${song.id}`).setLabel(`ouvir #${song.id}`).setStyle(ButtonStyle.Primary)
      ));

      await interaction.reply({ embeds: [embed], components: buttonRows, ephemeral: true });
      return;
    }

    if (interaction.customId === 'playlist:random') {
      const entry = await getRandomUnlockedPlaylistEntryByUser(interaction.client.db, interaction.user.id);
      if (!entry) {
        await interaction.reply({
          content: 'O silêncio ainda guarda essa parte. Libere algumas músicas primeiro. 🌙',
          ephemeral: true
        });
        return;
      }

      const embed = musicDetailsEmbed(entry).setDescription('Hoje o coração escolheu esta canção para você.');
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (interaction.customId.startsWith('playlist:listen:')) {
      const id = Number(interaction.customId.split(':')[2]);
      const entry = await getPlaylistEntryById(interaction.client.db, id);

      if (!entry || !entry.is_unlocked || entry.created_by !== interaction.user.id) {
        await interaction.reply({ content: 'Essa música ainda não pode ser ouvida aqui. 🔒', ephemeral: true });
        return;
      }

      await interaction.reply({ embeds: [musicDetailsEmbed(entry)], ephemeral: true });
      return;
    }

    if (interaction.customId === 'playlist:back') {
      const { introEmbed, row, secondaryRow } = buildNozinhoMainPanel();
      await interaction.update({ embeds: [introEmbed], components: [row, secondaryRow] });
    }
  } catch (error) {
    console.error('[PLAYLIST] Erro nos botões:', error);
    throw error;
  }
}

async function handlePlaylistModalSubmit(interaction) {
  try {
    await createPlaylistEntry(interaction.client.db, {
      title: interaction.fields.getTextInputValue('title')?.trim(),
      artist: interaction.fields.getTextInputValue('artist')?.trim(),
      url: interaction.fields.getTextInputValue('url')?.trim(),
      description: interaction.fields.getTextInputValue('description')?.trim(),
      mood: interaction.fields.getTextInputValue('mood')?.trim(),
      createdBy: interaction.user.id
    });

    await interaction.reply({
      content: 'Música guardada na biblioteca romântica do Nózinho. 🎵',
      ephemeral: true
    });
  } catch (error) {
    console.error('[PLAYLIST] Erro ao salvar música:', error);
    throw error;
  }
}

module.exports = {
  openPlaylistPanel,
  handlePlaylistButtons,
  handlePlaylistModalSubmit
};
