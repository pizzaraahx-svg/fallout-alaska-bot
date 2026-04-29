const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');

async function postRobMessage(client) {
  const channel = await client.channels.fetch(process.env.REGISTRATION_CHANNEL_ID);

  const existing = await channel.messages.fetch({ limit: 10 });
  const alreadyPosted = existing.find(m =>
    m.author.id === client.user.id &&
    m.components.length > 0
  );
  if (alreadyPosted) return;

  const webhooks = await channel.fetchWebhooks();
  let webhook = webhooks.find(w => w.name === 'Rob');
  if (!webhook) {
    webhook = await channel.createWebhook({
      name: 'Rob',
      avatar: process.env.ROB_AVATAR_URL || null,
    });
  }

  const embed = new EmbedBuilder()
    .setDescription(
      `Hey. Name's Rob. I'll keep this short 'cause that's how things go out here.\n\n` +
      `Everybody round' the wasteland understands the risk of death. Shepherds or no Shepherds — ` +
      `the brain's still a fragile thing.\n\n` +
      `So somewhere along the way people started writin' things down. First page of whatever they carry. ` +
      `A name. A couple words. Maybe a sketch of their own face so the raider standin' over their body ` +
      `knows who they just killed.\n\n` +
      `*Custom now.* You prepare for it. Anticipate it. And when it comes — and it comes for everybody — ` +
      `you're already above it.\n\n` +
      `Don't overthink it. It ain't a form. Just — whoever finds this, here's who I was.\n\n` +
      `*Give it a go.*`
    )
    .setFooter({ text: 'keep it or burn it' })
    .setColor(0x2b2b2b);

  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('open_journal')
      .setLabel('open your journal')
      .setStyle(ButtonStyle.Secondary)
  );

  await webhook.send({
    embeds: [embed],
    components: [button],
    username: 'Rob',
    avatarURL: process.env.ROB_AVATAR_URL || undefined,
  });
}

module.exports = { postRobMessage };
