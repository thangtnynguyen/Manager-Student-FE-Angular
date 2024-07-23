import { User } from './user.interface';

export interface UserCurrent extends User {
  roles: string[];
}
