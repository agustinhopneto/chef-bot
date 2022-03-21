import { Interaction } from 'discord.js';

import { InteractionService } from '../services/interactionService';
import { TastyApiService } from '../services/tastyApiService';
import parseInteraction from './parseInteraction';

const handleInteraction = async (
  interaction: Interaction,
  tastyApiService: TastyApiService,
) => {
  if (!interaction.isButton()) return;

  const { command, content } = parseInteraction(interaction);

  const interactionService = new InteractionService(
    interaction,
    tastyApiService,
  );

  await interactionService.runInteraction({ command, content });
};

export default handleInteraction;
