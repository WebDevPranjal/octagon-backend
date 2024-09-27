import { Request, Response, NextFunction } from "express";
import {
  createInvoiceService,
  getAllInvoicesService,
  getInvoiceByIdService,
  deleteInvoiceService,
  updateInvoiceService,
} from "../services/service.js";
import logger from "../../utils/logger.js";

const createInvoice = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;

    if (!data) {
      logger.error("Invoice creation failed: Missing data");
      return res
        .status(400)
        .json({ msg: "Missing invoice data", success: false, data: null });
    }

    const invoice = await createInvoiceService(data);

    logger.info(`Invoice created: ${invoice?.invoiceNumber}`);
    res.status(201).json({
      msg: "Invoice created successfully",
      data: invoice,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Invoice creation failed: ${error.message}`);
    res
      .status(500)
      .json({ msg: "Invoice creation failed", success: false, data: null });
  }
};

const getAllInvoices = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access to invoices");
      return res
        .status(401)
        .json({ msg: "Unauthorized", data: null, success: false });
    }

    const userId = req.user._id;
    const invoices = await getAllInvoicesService(userId);

    logger.info(`Invoices fetched for user: ${userId}`);
    res.status(200).json({
      msg: "Invoices fetched successfully",
      data: invoices,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Invoice creation failed: ${error.message}`);
    res
      .status(500)
      .json({ msg: "Invoice creation failed", success: false, data: null });
  }
};

const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.error("Invoice ID is missing");
      return res
        .status(400)
        .json({ msg: "Missing invoice ID", data: null, success: false });
    }

    const invoice = await getInvoiceByIdService(id);

    if (!invoice) {
      logger.error(`Invoice not found: ${id}`);
      return res
        .status(404)
        .json({ msg: "Invoice not found", data: null, success: false });
    }

    logger.info(`Invoice fetched: ${id}`);
    res.status(200).json({
      msg: "Invoice fetched successfully",
      data: invoice,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Invoice creation failed: ${error.message}`);
    res
      .status(500)
      .json({ msg: "Invoice creation failed", data: null, success: false });
  }
};

const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    if (!id || !data) {
      logger.error("Invoice update failed: Missing ID or data");
      return res.status(400).json({
        msg: "Missing invoice ID or data",
        success: false,
        data: null,
      });
    }

    const invoice = await updateInvoiceService(id, data);

    if (!invoice) {
      logger.error(`Invoice not found for update: ${id}`);
      return res
        .status(404)
        .json({ msg: "Invoice not found", success: false, data: null });
    }

    logger.info(`Invoice updated: ${id}`);
    res.status(200).json({
      msg: "Invoice updated successfully",
      data: invoice,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Invoice update failed: ${error.message}`);
    return res
      .status(500)
      .json({ msg: "Invoice update failed", success: false, data: null });
  }
};

const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.error("Invoice deletion failed: Missing ID");
      return res
        .status(400)
        .json({ msg: "Missing invoice ID", data: null, success: false });
    }

    const invoice = await deleteInvoiceService(id);

    if (!invoice) {
      logger.error(`Invoice not found for deletion: ${id}`);
      return res
        .status(404)
        .json({ msg: "Invoice not found", data: null, success: false });
    }

    logger.info(`Invoice deleted: ${id}`);
    res
      .status(200)
      .json({
        msg: "Invoice deleted successfully",
        data: invoice,
        success: true,
      });
  } catch (error: any) {
    logger.error(`Invoice deletion failed: ${error.message}`);
    return res
      .status(500)
      .json({ msg: "Invoice deletion failed", success: false, data: null });
  }
};

export {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
