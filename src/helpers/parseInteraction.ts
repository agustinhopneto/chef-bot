import { ButtonInteraction } from 'discord.js';

export type InteractionOpts = {
  content: string;
  command: string;
};

const parseInteraction = (interaction: ButtonInteraction): InteractionOpts => {
  const { customId } = interaction;

  const [command, content] = customId.split('-');

  return { command, content };
};

export default parseInteraction;
