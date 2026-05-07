const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const {
  createLetter,
  listLettersByUser,
  listUnlockedLettersByUser,
  getLetterById
} = require('./lettersRepository');
const {
  buildLettersPanelEmbed,
  buildLettersPanelButtons,
  buildWriteLetterModal
} = require('./lettersUI');
const { buildNozinhoMainPanel } = require('../../commands/nozinho');
const { sendOwnerLog } = require('../notifications/ownerLog');

async function openLettersPanel(interaction) {
  try {
    const embed = buildLettersPanelEmbed();
    const row = buildLettersPanelButtons();

    await interaction.update({
      embeds: [embed],
      components: [row]
    });
  } catch (error) {
    console.error('[LETTERS] Erro ao abrir painel de cartinhas:', error);
    throw error;
  }
}

async function handleLettersButtons(interaction) {
  try {
    if (interaction.customId === 'letters:write') {
      const modal = buildWriteLetterModal();
      await interaction.showModal(modal);
      return;
    }

    if (interaction.customId === 'letters:list') {
      const rows = await listLettersByUser(interaction.client.db, interaction.user.id, 5);

      if (!rows.length) {
        await interaction.reply({ content: 'Você ainda não guardou cartinhas no baú do Nózinho. 💌', ephemeral: true });
        return;
      }

      const lines = rows.map((letter, index) => {
        const status = letter.is_unlocked ? 'liberada' : 'guardada';
        return `${index + 1}. **${letter.title}** · sentimento: *${letter.mood}* · status: **${status}**`;
      });

      const embed = new EmbedBuilder()
        .setColor(0xf9a8d4)
        .setTitle('Minhas cartinhas')
        .setDescription(lines.join('\n'))
        .setFooter({ text: 'Mostrando até 5 cartinhas mais recentes.' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (interaction.customId === 'letters:unlocked') {
      const rows = await listUnlockedLettersByUser(interaction.client.db, interaction.user.id, 5);

      if (!rows.length) {
        await interaction.reply({
          content: 'Você ainda não tem cartinhas liberadas. Quando liberar, elas aparecem aqui. ✨',
          ephemeral: true
        });
        return;
      }

      const lines = rows.map((letter, index) => {
        const unlockedAt = letter.unlocked_at || 'data desconhecida';
        return `${index + 1}. **${letter.title}** · sentimento: *${letter.mood}* · liberada em: **${unlockedAt}**`;
      });

      const embed = new EmbedBuilder()
        .setColor(0xfda4af)
        .setTitle('Cartas liberadas')
        .setDescription(lines.join('\n'))
        .setFooter({ text: 'Use os botões abaixo para ler cada cartinha.' })
        .setTimestamp();

      const buttonRows = rows.map((letter) => new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`letters:read:${letter.id}`)
          .setLabel(`ler #${letter.id}`)
          .setStyle(ButtonStyle.Primary)
      ));

      await interaction.reply({
        embeds: [embed],
        components: buttonRows,
        ephemeral: true
      });
      return;
    }

    if (interaction.customId.startsWith('letters:read:')) {
      const id = Number(interaction.customId.split(':')[2]);
      const letter = await getLetterById(interaction.client.db, id);

      if (!letter || !letter.is_unlocked || letter.created_by !== interaction.user.id) {
        await interaction.reply({
          content: 'Essa cartinha não está disponível para leitura agora. 🔒',
          ephemeral: true
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0xfbcfe8)
        .setTitle(letter.title)
        .setDescription(letter.body)
        .addFields(
          { name: 'Sentimento', value: letter.mood, inline: true },
          { name: 'Liberada em', value: letter.unlocked_at || 'sem registro', inline: true }
        )
        .setFooter({ text: `Cartinha #${letter.id}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (interaction.customId === 'letters:back') {
      const { introEmbed, row, secondaryRow } = buildNozinhoMainPanel();
      await interaction.update({ embeds: [introEmbed], components: [row, secondaryRow] });
    }
  } catch (error) {
    console.error('[LETTERS] Erro ao lidar com botões de cartinhas:', error);
    throw error;
  }
}

async function handleLetterModalSubmit(interaction) {
  try {
    const title = interaction.fields.getTextInputValue('title')?.trim();
    const body = interaction.fields.getTextInputValue('body')?.trim();
    const mood = interaction.fields.getTextInputValue('mood')?.trim();
    const unlockType = interaction.fields.getTextInputValue('unlock_type')?.trim();
    const unlockValue = interaction.fields.getTextInputValue('unlock_value')?.trim();

    const savingMessages = [
      'Sua cartinha foi guardada com carinho no baú do Nózinho. 💗',
      'Prontinho... guardei essa cartinha entre estrelas e fitinhas cor-de-rosa. ✨💌',
      'Cartinha salva com sucesso! O baú sorriu baixinho quando você escreveu. 🌸🤍'
    ];

    const createdId = await createLetter(interaction.client.db, {
      title,
      body,
      mood,
      unlockType,
      unlockValue,
      createdBy: interaction.user.id
    });

    await interaction.reply({
      content: savingMessages[Math.floor(Math.random() * savingMessages.length)],
      ephemeral: true
    });

    await sendOwnerLog(interaction.client, {
      action: 'Nova cartinha criada',
      userTag: interaction.user.tag,
      userId: interaction.user.id,
      detail: `Carta #${createdId} · ${title}`
    });
  } catch (error) {
    console.error('[LETTERS] Erro ao salvar cartinha:', error);
    throw error;
  }
}

module.exports = {
  openLettersPanel,
  handleLettersButtons,
  handleLetterModalSubmit
};
