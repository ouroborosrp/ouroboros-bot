import { db, schema } from '@/db';
import Logger from '@/lib/logger';
import { Cron } from 'croner';
import { formatDistance } from 'date-fns';
import { eq, inArray } from 'drizzle-orm';

export const updateUserQuota = Cron('0 0 */12 * * *', { paused: true }, async () => {
  const logger = new Logger({
    name: 'Job:UpdateUserQuota',
  });
  const nextRun = formatDistance(updateUserQuota.nextRun()!, new Date(), { includeSeconds: true });

  try {
    // Fetch all users with quota 0
    const users = await db.select().from(schema.users).where(eq(schema.users.quota, 0));

    if (users.length === 0) {
      logger.info('No users with quota 0 found');
      logger.info('Next cron job in', nextRun);
      return;
    }

    await db
      .update(schema.users)
      .set({ quota: 2 })
      .where(
        inArray(
          schema.users.id,
          users.map((ip) => ip.id),
        ),
      );
  } catch (error) {
    logger.error('Failed to update users:', error);
  }
});
