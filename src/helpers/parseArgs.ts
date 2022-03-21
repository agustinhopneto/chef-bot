import commandLine from 'command-line-args';
import stringArgv from 'string-argv';

export type BotOptions = {
  command?: string;
  query?: string;
};

const argumentsOptions = (trigger: string) => [
  { name: 'command', alias: trigger, type: String, multiple: true },
  { name: 'query', alias: 'q', type: String, multiple: true },
];

const parseArgs = (content: string, trigger: string): BotOptions => {
  const argv = stringArgv(content);

  const { command, query } = commandLine(argumentsOptions(trigger), {
    argv,
  });

  const options = {
    command: command.join('').toLowerCase(),
    query: query?.join(' '),
  };

  return options;
};

export default parseArgs;
