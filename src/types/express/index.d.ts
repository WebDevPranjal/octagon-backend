import { Request } from "express";
import User from "../../app/users/modals/modal.js";

type userWithId = typeof User & { _id: string };

declare global {
  namespace Express {
    interface Request {
      user?: userWithId;
    }
  }
}
