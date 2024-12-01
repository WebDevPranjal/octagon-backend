import e, { Router } from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  currentMonthInvoices,
  customerWiseInvoices,
  monthWiseInvoices,
} from "../controller/controller.js";

const router = Router();

router.get("/get", getAllInvoices);
router.get("/get/:id", getInvoiceById);
router.post("/create", createInvoice);
router.put("/update/:id", updateInvoice);
router.delete("/delete/:id", deleteInvoice);
router.get("/current", currentMonthInvoices);
router.get("/customer-wise", customerWiseInvoices);
router.get("/month-wise-invoices", monthWiseInvoices);

export default router;
