import ClientUserSession from './client-user-session.interface';

interface SignInResponse {
  session: ClientUserSession;
  token: string;
}

export default SignInResponse;
