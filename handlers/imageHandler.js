const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

async function handleImage(message, client) {
  const session = client.pendingSessions.get(message.author.id);
  if (!session) return;

  const skipped = message.content.toLowerCase() === 'skip';
  const attachment = message.attachments.first();

  if (!skipped && !attachment) return;

  client.pendingSessions.delete(message.author.id);

  const channel = await client.channels.fetch(session.channelId);

  const webhooks = await channel.fetchWebhooks();
  const webhook = webhooks.find(w => w.name === 'Rob');

  const leftPage = new EmbedBuilder()
    .setAuthor({ name: session.name })
    .setColor(0x3b2f1e)
    .setFooter({ text: session.faction });

  if (attachment) {
    leftPage.setImage(attachment.url);
  } else {
    leftPage.setDescription('*no drawing*');
  }

  const rightPage = new EmbedBuilder()
    .setDescription(
      `*${session.entry}*\n\n— ${session.name}`
    )
    .setColor(0x1e2b2f)
    .setFooter({ text: `keep it or burn it` });

  await webhook.send({
    embeds: [leftPage, rightPage],
    username: 'Rob',
    avatarURL: process.env.ROB_AVATAR_URL || undefined,
  });

  try { await message.delete(); } catch {}
}

module.exports = { handleImage };
