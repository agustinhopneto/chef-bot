import { Message } from 'discord.js';

import { config } from '../config';
import { CommandService } from '../services/commandService';
import { TastyApiService } from '../services/tastyApiService';
import parseArgs from './parseArgs';
import getTriggerRegex from './triggerCommand';

const handleMessage = async (
  message: Message,
  tastyApiService: TastyApiService,
) => {
  const { content, author } = message;

  if (!content.match(getTriggerRegex()) || author.bot) return;

  const { command, query } = parseArgs(content, config.prefix);

  const commandService = new CommandService(message, tastyApiService);

  await commandService.runCommand({ command, query });
};

export default handleMessage;
