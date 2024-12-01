// @ts-nocheck
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../users/modals/modal.js";

export const userAuth = async (req: Request, res: Response, next: any) => {
  try {
    const token: string;

    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      token = req.headers.cookie.split(";")[0].split("=")[1];
    }

    if (!token) {
      return res.status(401).json({ msg: "Token is not provided" });
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "octagon-backend"
    );

    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorised" });
    }

    const { userId } = decoded;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    } else {
      req.user = user;
    }

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorised" });
  }
};
