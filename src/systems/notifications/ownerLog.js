const { EmbedBuilder } = require('discord.js');
const { ownerId } = require('../../config');

async function sendOwnerLog(client, payload) {
  try {
    if (!ownerId) return;
    const owner = await client.users.fetch(ownerId);
    if (!owner) return;

    const embed = new EmbedBuilder()
      .setColor(0xf9a8d4)
      .setTitle('Nózinho · Log Privado ✨')
      .setDescription(payload.action || 'Ação registrada.')
      .addFields(
        { name: 'Usuário', value: payload.userTag || 'desconhecido', inline: true },
        { name: 'ID', value: payload.userId || 'n/a', inline: true },
        { name: 'Detalhe', value: payload.detail || 'sem detalhe' }
      )
      .setTimestamp(new Date(payload.at || Date.now()));

    await owner.send({ embeds: [embed] });
  } catch (error) {
    console.error('[OWNER_LOG] Falha ao enviar DM para OWNER_ID:', error.message);
  }
}

module.exports = { sendOwnerLog };
