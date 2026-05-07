module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    try {
      console.log(`[BOT] Online como ${client.user.tag}.`);
    } catch (error) {
      console.error('[EVENT] Erro no ready:', error);
    }
  }
};
