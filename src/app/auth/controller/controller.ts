import { Request, Response } from "express";
import User from "../../users/modals/modal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger.js";

export interface UserPayload {
  userId: string;
  name: string;
  email: string;
}

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload: UserPayload = {
      userId: String(user._id),
      name: user.name,
      email: user.email,
    };

    const token: string = jwt.sign(
      payload,
      process.env.JWT_SECRET || "octagon-backend",
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });

    res.cookie("user", user, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });

    logger.info(`User logged in: ${user._id}`);

    res.status(200).json({
      message: "User logged in successfully",
      data: user,
      success: true,
    });
  } catch (error: any) {
    logger.error(`User login failed: ${error.message}`);
    res.status(500).json({
      message: "Error while logging in",
      success: false,
      data: null,
    });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    logger.info(`User registered: ${user._id}`);

    res.status(201).json({
      message: "User registered successfully",
      data: user,
      success: true,
    });
  } catch (error: any) {
    //console.log(error);
    logger.error(`User registration failed: ${error.message}`);

    res.status(500).json({
      message: "Error while registering user",
      success: false,
      data: null,
    });
  }
};

export { login, register };
