import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey(),
    ip: text('ip').notNull(),
    discordId: text('discord_id').notNull(),
    discordName: text('discord_name').notNull(),
    quota: integer('quota').default(2).notNull(),
    createdAt: integer('created_at').default(Date.now()),
    updatedAt: integer('created_at'),
  },
  (table) => ({
    ung: unique().on(table.ip, table.discordId),
  }),
);
