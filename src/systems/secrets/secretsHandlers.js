const { buildNozinhoMainPanel } = require('../../commands/nozinho');
const { buildSecretButtons, buildSecretEmbed } = require('./secretsUI');

async function openSecretPanelReply(interaction) {
  try {
    await interaction.reply({
      embeds: [buildSecretEmbed()],
      components: [buildSecretButtons()],
      ephemeral: true
    });
  } catch (error) {
    console.error('[SECRETS] Erro ao responder painel secreto:', error);
    throw error;
  }
}

async function openSecretPanelUpdate(interaction) {
  try {
    await interaction.update({
      embeds: [buildSecretEmbed()],
      components: [buildSecretButtons()]
    });
  } catch (error) {
    console.error('[SECRETS] Erro ao atualizar painel secreto:', error);
    throw error;
  }
}

async function handleSecretButtons(interaction) {
  try {
    if (interaction.customId === 'secret:chest') {
      await interaction.reply({
        content: 'Em breve, este baú vai guardar cartas e memórias secretas só de vocês. 🗝️',
        ephemeral: true
      });
      return;
    }

    if (interaction.customId === 'secret:hint') {
      await interaction.reply({
        content: 'Pista: algumas portas abrem quando o amor aprende a ouvir o silêncio. 🌙',
        ephemeral: true
      });
      return;
    }

    if (interaction.customId === 'secret:back') {
      const { introEmbed, row } = buildNozinhoMainPanel();
      await interaction.update({ embeds: [introEmbed], components: [row] });
    }
  } catch (error) {
    console.error('[SECRETS] Erro ao lidar com botões secretos:', error);
    throw error;
  }
}

module.exports = {
  openSecretPanelReply,
  openSecretPanelUpdate,
  handleSecretButtons
};
