import { Request, Response } from "express";
import User from "../../users/modals/modal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log(token);

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
    });

    res.status(200).json({ msg: "Login success" });
  } catch (error) {}
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

    res.status(201).json({ msg: "User created", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export { login, register };
