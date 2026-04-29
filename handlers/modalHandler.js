const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

async function handleJournalButton(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('journal_modal')
    .setTitle('— first page —');

  const nameInput = new TextInputBuilder()
    .setCustomId('character_name')
    .setLabel('name / what people call you')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('what they write on the grave')
    .setRequired(true)
    .setMaxLength(50);

  const entryInput = new TextInputBuilder()
    .setCustomId('journal_entry')
    .setLabel('the short version')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder("write it like you'd tell it to a stranger at a fire. one paragraph. no heroics.")
    .setRequired(true)
    .setMaxLength(800);

  const factionInput = new TextInputBuilder()
    .setCustomId('faction')
    .setLabel('runs with / faction')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('or just: nobody')
    .setRequired(false)
    .setMaxLength(60);

  modal.addComponents(
    new ActionRowBuilder().addComponents(nameInput),
    new ActionRowBuilder().addComponents(entryInput),
    new ActionRowBuilder().addComponents(factionInput),
  );

  await interaction.showModal(modal);
}

async function handleModal(interaction, client) {
  const name = interaction.fields.getTextInputValue('character_name');
  const entry = interaction.fields.getTextInputValue('journal_entry');
  const faction = interaction.fields.getTextInputValue('faction') || 'nobody';

  client.pendingSessions.set(interaction.user.id, {
    awaitingImage: true,
    channelId: interaction.channelId,
    name,
    entry,
    faction,
    userId: interaction.user.id,
    username: interaction.user.username,
  });

  await interaction.reply({
    content:
      `got it.\n\n` +
      `now — first page needs a face.\n\n` +
      `sketch it, draw it on your phone, scrawl it on paper and take a photo. ` +
      `black on light background reads best. doesn't have to be good. ` +
      `most folks out here aren't artists.\n\n` +
      `type **skip** if you're carrying nothing worth drawing.`,
    ephemeral: true
  });
}

module.exports = { handleJournalButton, handleModal };
