import {
  EmbedFieldData,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageEmbedOptions,
} from 'discord.js';

import { config } from '../config';
import { BotOptions } from '../helpers/parseArgs';
import parseLinkToText from '../helpers/parseLinkToText';
import { TastyApiService } from './tastyApiService';

export class CommandService {
  private readonly message: Message;

  private readonly tastyApiService: TastyApiService;

  constructor(message: Message, tastyApiService: TastyApiService) {
    this.message = message;
    this.tastyApiService = tastyApiService;
  }

  async recipes({ query }: BotOptions): Promise<void> {
    try {
      await this.message.reply({
        embeds: [
          new MessageEmbed({
            title: 'Loading...',
            description: 'This may take a few seconds...',
            color: 'YELLOW',
          }),
        ],
      });

      const recipes = await this.tastyApiService.getRecipes(query);

      if (!recipes.length) {
        const messageEmbed = new MessageEmbed({
          title: 'Error',
          description: `Hey ${this.message.member}, recipes not found to the "${query}" search!`,
          color: 'RED',
        });

        this.message.channel.send({ embeds: [messageEmbed] });

        return;
      }

      const data = recipes.map((item, index) => ({
        id: item.id,
        name: `${index + 1}. ${item.name}`,
        description:
          parseLinkToText(item.description) ||
          'This recipe has no description.',
        imageUrl: item.thumbnail_url,
        recipes: item.recipes,
      }));

      const row = new MessageActionRow();

      const embeds: any[] = [];

      data.forEach(({ id, name, description, imageUrl, recipes }, index) => {
        let recipeId = id;

        if (recipes && recipes.length) {
          recipeId = recipes[0].id;
        }

        const messageOpts: MessageEmbedOptions = {
          title: name,
          description,
          thumbnail: {
            url: imageUrl,
          },
        };

        embeds.push(new MessageEmbed(messageOpts));

        row.addComponents(
          new MessageButton()
            .setCustomId(`getRecipe-${String(recipeId)}`)
            .setLabel(String(index + 1))
            .setStyle('PRIMARY'),
        );
      });

      await this.message.reply({
        content: '**Choose a recipe:**',
        embeds,
        components: [row],
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error.message);

      const messageEmbed = new MessageEmbed({
        title: 'Error',
        description: `Hey ${this.message.member}, Something went wrong!`,
        color: 'RED',
      });

      await this.message.reply({ embeds: [messageEmbed] });
    }
  }

  async nudes() {
    const urls = [
      'https://cdn.discordapp.com/attachments/862699777636696105/954444665820704828/erick_coach.png',
      'https://cdn.discordapp.com/attachments/862699777636696105/954444644714942534/erick_coach_2.png',
    ];

    const helpMessage = new MessageEmbed({
      color: 'GREEN',
      image: {
        url: urls[Math.floor(Math.random() * urls.length)],
        width: 100,
        height: 100,
      },
    });

    await this.message.reply({ embeds: [helpMessage] });
  }

  async help(): Promise<void> {
    const fields: EmbedFieldData[] = [
      {
        name: `-${config.prefix} help`,
        value: 'List all commands.',
      },
      {
        name: `-${config.prefix} recipes <options>`,
        value: 'Search recipes from Tasty.',
      },
      {
        name: `-${config.prefix} nudes`,
        value: 'Well, you know...',
      },
      {
        name: '\u200B\nSearch recipe options:',
        value: '-----------------',
      },
      {
        name: '-q <query>',
        value: 'Search by a query.',
      },
      {
        name: 'Example:',
        value: `-${config.prefix} recipes -q french fries`,
      },
    ];

    const content = `Hey, ${this.message.member}! Here are all available commands:`;

    const helpMessage = new MessageEmbed({
      title: 'List commands',
      description: content,
      color: 'BLUE',
      fields,
    });

    await this.message.reply({ embeds: [helpMessage] });
  }

  async runCommand(opts: BotOptions): Promise<void> {
    const { command } = opts;

    if (command === 'runCommand' || !this[command]) {
      return;
    }

    await this[command](opts);
  }
}
