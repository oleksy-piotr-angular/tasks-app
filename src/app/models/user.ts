import { SessionToken } from './types';

export interface User {
  email: string;
  password: string;
}

export interface SignedUser extends User {
  _id: { $oid: string };
  sessionToken: SessionToken;
}
