import { Session } from 'express-session';

export interface AccountProfile {
  id?: string;
  _id?: string;
  firstName: string;
  lastName: string;
  password?: string;
  email: string;
  gender: string;
  phone: string;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
  avatar?: string;
  role?: [string];
}

export interface ExpressSessionUser extends Session {
  userId?: string;
  user?: AccountProfile;
}
