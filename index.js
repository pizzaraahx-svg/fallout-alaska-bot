require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { postRobMessage } = require('./handlers/robMessage');
const { handleJournalButton, handleModal } = require('./handlers/modalHandler');
const { handleImage } = require('./handlers/imageHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

client.pendingSessions = new Map();

client.once('ready', async () => {
  console.log(`Rob is online as ${client.user.tag}`);
  await postRobMessage(client);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isButton() && interaction.customId === 'open_journal') {
    await handleJournalButton(interaction);
  }
  if (interaction.isModalSubmit() && interaction.customId === 'journal_modal') {
    await handleModal(interaction, client);
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  const session = client.pendingSessions.get(message.author.id);
  if (session?.awaitingImage) {
    await handleImage(message, client);
  }
});

client.login(process.env.DISCORD_TOKEN);
