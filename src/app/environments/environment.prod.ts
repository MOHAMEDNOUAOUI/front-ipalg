import { Environment } from './env.interface';

export const URI = 'prod';
export const environment: Environment = {
  services: {
    auth: URI + '/',
    users: URI + '/',
  },
};
