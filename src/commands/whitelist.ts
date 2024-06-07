import { db, schema } from '@/db';
import type { Command } from '@/lib/command';
import { whitelistUser } from '@/lib/whitelist';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const whitelist: Command = {
  name: 'whitelist-ip',
  description: 'Whitelist your home IP address',
  options: [
    {
      name: 'ip',
      description: 'Your home IP address (v4)',
      required: true,
      type: 'string',
    },
  ],
  execute: async (interaction) => {
    try {
      const options = interaction.options.data;
      const ip = z
        .string()
        .ip({
          version: 'v4',
        })
        .parse(options.find((o) => o.name === 'ip')?.value);

      const discordId = interaction.user.id;
      const discordName = interaction.user.username;

      const users = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.discordId, discordId))
        .limit(1)
        .execute();

      if (users.length === 0) {
        // Create a new user
        try {
          await whitelistUser(discordId, ip);
          await db.insert(schema.users).values({
            ip,
            discordId,
            discordName,
            quota: 1,
          });
          await interaction.reply({ content: `Whitelisted IP address ${ip}. Have fun!`, ephemeral: true });
          return;
        } catch (error) {
          await interaction.reply({ content: `Failed to whitelist IP address ${ip}.`, ephemeral: true });
          return;
        }
      }

      const user = users[0];
      if (user.quota === 0) {
        await interaction.reply({
          content: `You have used up your quota. Please wait 24h to update your IP again.`,
          ephemeral: true,
        });
        return;
      }

      // Save the IP address to the database
      try {
        await whitelistUser(discordId, ip);
        await db
          .update(schema.users)
          .set({ ip, quota: user.quota - 1 })
          .where(eq(schema.users.discordId, discordId));

        await interaction.reply({
          content: `Whitelisted IP address ${ip}, ${user.quota - 1} quota left`,
          ephemeral: true,
        });
      } catch (error) {
        await interaction.reply({ content: `Failed to whitelist IP address ${ip}.`, ephemeral: true });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        await interaction.reply('Invalid IP address');
        return;
      }
      throw error;
    }
  },
};

export default whitelist;
