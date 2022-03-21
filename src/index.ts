/* eslint-disable import/order */
/* eslint-disable import-helpers/order-imports */

import { config } from './config';

import { Client } from 'discord.js';
import { TastyApiService } from './services/tastyApiService';
import { handleInteraction, handleMessage } from './helpers';

const { token, prefix, rapidHost, rapidKey, rapidTastyApiUrl } = config;

const tastyApiService = new TastyApiService(
  rapidTastyApiUrl,
  rapidHost,
  rapidKey,
);

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_PRESENCES'],
});

client.on('ready', () => {
  client.user?.setPresence({
    activities: [{ name: `-${prefix} <command>`, type: 'LISTENING' }],
  });

  // eslint-disable-next-line no-console
  console.log(
    '\x1b[36m',
    `Bot is ready! Logged in as ${client.user?.tag}!`,
    '\x1b[0m',
  );
});

client.on('messageCreate', message => handleMessage(message, tastyApiService));

client.on('interactionCreate', interaction =>
  handleInteraction(interaction, tastyApiService),
);

client.login(token);
