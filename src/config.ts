import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const REQUIRED_ENV_VARS = [
  'DISCORD_BOT_TOKEN',
  'RAPID_TASTY_API_URL',
  'RAPID_HOST',
  'RAPID_KEY',
];

REQUIRED_ENV_VARS.forEach(envVar => {
  const val = process.env[envVar];

  if (!val) {
    throw new Error(`Required ENV VAR not set: ${envVar}`);
  }
});

export const config = {
  token: process.env.DISCORD_BOT_TOKEN as string,
  prefix: process.env.DISCORD_BOT_PREFIX || 'e',
  rapidTastyApiUrl: process.env.RAPID_TASTY_API_URL as string,
  rapidHost: process.env.RAPID_HOST as string,
  rapidKey: process.env.RAPID_KEY as string,
};
