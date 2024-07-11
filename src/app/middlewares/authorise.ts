import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../users/modals/modal.js";

export const userAuth = async (req: Request, res: Response, next: any) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ msg: "Token is not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorised" });
    }

    const { userId } = decoded;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: "Unauthorised" });
  }
};
