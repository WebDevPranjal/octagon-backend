import express from "express";
import { updateUser, deleteUser, getUser } from "../controller/controller.js";

const router = express.Router();

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/", getUser);

export default router;
