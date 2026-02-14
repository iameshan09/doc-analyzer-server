import { UserAccountDocument } from '../schemas/user-accout.schema';

interface ClientUserSession
  extends Pick<UserAccountDocument, 'firstName' | 'lastName' | 'email'> {
  id: string;

  // fcm?: string;

  // signer?: string;

  // kyc: boolean;
}

export default ClientUserSession;
