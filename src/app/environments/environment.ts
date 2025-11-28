import { Environment } from './env.interface';

export const URI = 'http://localhost:8082';
export const environment: Environment = {
  services: {
    auth: URI + '/api',
    users: URI + '/api/users',
  },
};
