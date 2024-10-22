import { User } from './entities/user.entity'; // Import your user entity

declare global {
  namespace Express {
    interface Request {
      user: User; // Optional, or remove '?' if you always expect a user to exist
    }
  }
}