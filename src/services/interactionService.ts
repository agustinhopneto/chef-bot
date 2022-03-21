import { ButtonInteraction, EmbedFieldData, MessageEmbed } from 'discord.js';

import { parseLinkToText } from '../helpers';
import { InteractionOpts } from '../helpers/parseInteraction';
import { TastyApiService } from './tastyApiService';

export class InteractionService {
  private readonly interaction: ButtonInteraction;

  private readonly tastyApiService: TastyApiService;

  constructor(
    interaction: ButtonInteraction,
    tastyApiService: TastyApiService,
  ) {
    this.interaction = interaction;
    this.tastyApiService = tastyApiService;
  }

  async getRecipe({ content }: InteractionOpts): Promise<void> {
    try {
      await this.interaction.channel.send({
        embeds: [
          new MessageEmbed({
            title: 'Loading...',
            description: 'This may take a few seconds...',
            color: 'YELLOW',
          }),
        ],
      });

      const {
        name,
        yields,
        thumbnail_url: thumbnailUrl,
        description,
        sections,
        instructions: tastyInstructions,
        slug,
      } = await this.tastyApiService.getRecipeById(Number(content));

      const fields: EmbedFieldData[] = [];

      const servingField: EmbedFieldData = {
        name: 'Servings',
        value: yields || 'No information.',
        inline: true,
      };

      fields.push(servingField);

      const ingredients: string[] = [];

      sections.forEach(section => {
        section.components.forEach(({ raw_text: rawText }, index) => {
          ingredients.push(`**${index + 1}.** ${rawText}`);
        });
      });

      fields.push({
        name: 'Ingredients',
        value: ingredients.join('\n'),
        inline: false,
      });

      const instructions: string[] = [];

      tastyInstructions.forEach(({ display_text: displayText }, index) => {
        instructions.push(`**${index + 1}.** ${displayText}`);
      });

      const instructionsText = instructions.join('\n');

      const value =
        instructionsText.length > 1021
          ? `${instructionsText.substring(0, 1020)}...`
          : instructionsText;

      fields.push({
        name: 'Instructions',
        value,
        inline: false,
      });

      const sendMessage = new MessageEmbed({
        title: name,
        description:
          parseLinkToText(description) || 'This recipe has no description.',
        image: {
          url: thumbnailUrl,
        },
        color: 'GREEN',
        fields,
        author: {
          name: 'See the complete recipe here...',
          url: `https://tasty.co/recipe/${slug}`,
        },
      });

      await this.interaction.reply({ embeds: [sendMessage] });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);

      const messageEmbed = new MessageEmbed({
        title: 'Error',
        description: `Hey ${this.interaction.member}, Something went wrong!`,
        color: 'RED',
      });

      await this.interaction.reply({ embeds: [messageEmbed] });
    }
  }

  async runInteraction(opts: InteractionOpts): Promise<void> {
    const { command } = opts;

    if (command === 'runInteraction' || !this[command]) {
      return;
    }

    await this[command](opts);
  }
}
