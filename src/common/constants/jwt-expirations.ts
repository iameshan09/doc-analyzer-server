import { StringValue } from 'ms';

const jwtExpirations: Record<string, StringValue> = {
  userSession: '7d',
  accountVerification: '1d',
};

export default jwtExpirations;
