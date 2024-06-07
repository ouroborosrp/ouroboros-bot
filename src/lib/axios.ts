import axios from 'axios';
import { env } from './env';

const instance = axios.create({
  baseURL: 'https://ouroborosrp.com/api/external',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + env.BOT_SECRET,
  },
});

export default instance;
