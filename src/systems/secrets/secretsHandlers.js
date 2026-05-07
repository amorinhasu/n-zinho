const { buildNozinhoMainPanel } = require('../../commands/nozinho');
const { buildSecretButtons, buildSecretEmbed } = require('./secretsUI');

function buildSecretWelcomeEmbed() {
  const welcomeLines = [
    'A porta secreta rangeu devagar... e deixou você entrar com carinho. 💌',
    'O cantinho oculto acendeu uma luz quentinha só para você. 🕯️🤍',
    'As estrelas daqui sussurram baixinho: “bem-vinda(o) ao segredo”. ✨'
  ];

  return buildSecretEmbed().setDescription(`${welcomeLines[Math.floor(Math.random() * welcomeLines.length)]}\n\nVocê encontrou a passagem escondida... aqui moram segredos doces, memórias leves e silêncios que abraçam. ୨ৎ`);
}

async function openSecretPanelReply(interaction) {
  try {
    await interaction.reply({
      embeds: [buildSecretWelcomeEmbed()],
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
      embeds: [buildSecretWelcomeEmbed()],
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
      const { introEmbed, row, secondaryRow } = buildNozinhoMainPanel();
      await interaction.update({ embeds: [introEmbed], components: [row, secondaryRow] });
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
