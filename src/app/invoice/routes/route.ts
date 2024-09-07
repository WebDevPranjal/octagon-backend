import e, { Router } from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controller/controller.js";

const router = Router();

router.get("/get", getAllInvoices);
router.get("/get/:id", getInvoiceById);
router.post("/create", createInvoice);
router.put("/update/:id", updateInvoice);
router.delete("/delete/:id", deleteInvoice);

export default router;
