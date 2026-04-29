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
      `Hey, buddy. Get too drunk or what? Found you face-first in the snow. Out cold... No pun intended--Rob, by the way.\n\n` +
      `...Well, anyways, I was searching ya', and I notice... You don't have any identification, nothing. Not even a little territory claim in your journal--You don't even have a journal--Matter of fact... You don't have much of anything other than some cloth on ya'.`
      `Here. Take this extra one. ` +
      `A name. A couple "kind" words. Maybe a sketch of your face? So the raider standin' over your body lootin' ya can get a piece of you post-mortem.` +
      `...And so they know who they just killed, I suppose.\n\n` +
      `*It's custom around here, if you don't already know.* You prepare for it. Anticipate it. And when it comes--and it comes for everybody--` +
      `you're already above it.\n\n` +
      `Don't overthink it. It ain't a form. Just — whoever finds this, here's who I was... and here's what I think of you being in my journal.\n\n` +
      `*Give it a go.*`
    )

  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('open_journal')
      .setLabel('OPEN YOUR JOURNAL')
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
