export interface User {
  _id?: { $oid: string };
  email?: string;
  password?: string;
  sessionToken?: string;
  loggedIn?: Boolean;
}
