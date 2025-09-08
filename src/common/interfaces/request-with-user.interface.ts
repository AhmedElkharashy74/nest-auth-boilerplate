// common/interfaces/request-with-user.interface.ts
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}