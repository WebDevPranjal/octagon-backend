import { Request, Response } from "express";
import { deleteUserService, updateUserService } from "../services/service.js";
import User from "../modals/modal.js";

const getUser = async (req: Request, res: Response) => {
  try {
    const id = req?.user?._id;
    const user = await User.findById(id);

    const data = {
      name: user?.name,
      email: user?.email,
      customer: user?.customer,
      gstIN: user?.gstIN,
      dlNumber: user?.dlNumber,
    };

    res.status(200).json({ message: "User fetched", data, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const user = updateUserService(id, data);
    res.status(200).json({ msg: "User updated", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = deleteUserService(id);
    res.status(200).json({ msg: "User deleted", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export { updateUser, deleteUser, getUser };
