import { Environment } from './env.interface';

export const URI = 'http://192.168.100.179:9790';
export const environment: Environment = {
  services: {
    auth: URI + '/',
    users: URI + '/',
  },
};
