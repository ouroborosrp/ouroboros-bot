import instance from './axios';
import { logger } from './logger';

export const whitelistUser = async (discordId: string, ip: string) => {
  try {
    const response = await instance.post('/whitelist', {
      discordId,
      ip,
    });

    return response.data;
  } catch (error) {
    logger.error('Failed to whitelist user:', discordId, ip, error);
    throw error;
  }
};
