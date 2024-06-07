import { cleanEnv, str } from 'envalid';

export const env = cleanEnv(process.env, {
  BOT_TOKEN: str(),
  APPLICATION_ID: str(),
  DB_NAME: str({
    default: 'data/db.sqlite',
  }),
  ADMINS: str(),
  BOT_SECRET: str(),
});
