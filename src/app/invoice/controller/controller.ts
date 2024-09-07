import { Request, Response, NextFunction } from "express";
import {
  createInvoiceService,
  getAllInvoicesService,
  getInvoiceByIdService,
  deleteInvoiceService,
  updateInvoiceService,
} from "../services/service.js";
import logger from "../../utils/logger.js";
import asyncHandler from "../../utils/async-handler.js";

const createInvoice = asyncHandler(async (req: Request, res: Response) => {
  const { data } = req.body;

  if (!data) {
    logger.error("Invoice creation failed: Missing data");
    return res.status(400).json({ msg: "Missing invoice data" });
  }

  const invoice = await createInvoiceService(data);

  logger.info(`Invoice created: ${invoice?.invoiceNumber}`);
  res.status(201).json({ msg: "Invoice created successfully", data: invoice });
});

const getAllInvoices = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    logger.warn("Unauthorized access to invoices");
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const userId = req.user._id;
  const invoices = await getAllInvoicesService(userId);

  logger.info(`Invoices fetched for user: ${userId}`);
  res
    .status(200)
    .json({ msg: "Invoices fetched successfully", data: invoices });
});

const getInvoiceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    logger.error("Invoice ID is missing");
    return res.status(400).json({ msg: "Missing invoice ID" });
  }

  const invoice = await getInvoiceByIdService(id);

  if (!invoice) {
    logger.error(`Invoice not found: ${id}`);
    return res.status(404).json({ msg: "Invoice not found" });
  }

  logger.info(`Invoice fetched: ${id}`);
  res.status(200).json({ msg: "Invoice fetched successfully", data: invoice });
});

const updateInvoice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data } = req.body;

  if (!id || !data) {
    logger.error("Invoice update failed: Missing ID or data");
    return res.status(400).json({ msg: "Missing invoice ID or data" });
  }

  const invoice = await updateInvoiceService(id, data);

  if (!invoice) {
    logger.error(`Invoice not found for update: ${id}`);
    return res.status(404).json({ msg: "Invoice not found" });
  }

  logger.info(`Invoice updated: ${id}`);
  res.status(200).json({ msg: "Invoice updated successfully", data: invoice });
});

const deleteInvoice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    logger.error("Invoice deletion failed: Missing ID");
    return res.status(400).json({ msg: "Missing invoice ID" });
  }

  const invoice = await deleteInvoiceService(id);

  if (!invoice) {
    logger.error(`Invoice not found for deletion: ${id}`);
    return res.status(404).json({ msg: "Invoice not found" });
  }

  logger.info(`Invoice deleted: ${id}`);
  res.status(200).json({ msg: "Invoice deleted successfully", data: invoice });
});

export {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
