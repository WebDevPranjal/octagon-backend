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
        .json({ message: "Missing invoice data", success: false, data: null });
    }

    const invoice = await createInvoiceService(data);

    logger.info(`Invoice created: ${invoice?.invoiceNumber}`);
    res.status(201).json({
      message: "Invoice created successfully",
      data: invoice,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Invoice creation failed: ${error.message}`);
    res
      .status(500)
      .json({ message: "Invoice creation failed", success: false, data: null });
  }
};

const getAllInvoices = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access to invoices");
      return res
        .status(401)
        .json({ message: "Unauthorized", data: null, success: false });
    }

    const userId = req.user._id;
    const invoices = await getAllInvoicesService(userId);

    logger.info(`Invoices fetched for user: ${userId}`);
    res.status(200).json({
      message: "Invoices fetched successfully",
      data: invoices,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Invoice creation failed: ${error.message}`);
    res
      .status(500)
      .json({ message: "Invoice creation failed", success: false, data: null });
  }
};

const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.error("Invoice ID is missing");
      return res
        .status(400)
        .json({ message: "Missing invoice ID", data: null, success: false });
    }

    const invoice = await getInvoiceByIdService(id);

    if (!invoice) {
      logger.error(`Invoice not found: ${id}`);
      return res
        .status(404)
        .json({ message: "Invoice not found", data: null, success: false });
    }

    logger.info(`Invoice fetched: ${id}`);

    res.status(200).json({
      message: "Invoice fetched successfully",
      data: invoice,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Invoice creation failed: ${error.message}`);
    res
      .status(500)
      .json({ message: "Invoice creation failed", data: null, success: false });
  }
};

const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    if (!id || !data) {
      logger.error("Invoice update failed: Missing ID or data");
      return res.status(400).json({
        message: "Missing invoice ID or data",
        success: false,
        data: null,
      });
    }

    const invoice = await updateInvoiceService(id, data);

    if (!invoice) {
      logger.error(`Invoice not found for update: ${id}`);
      return res
        .status(404)
        .json({ message: "Invoice not found", success: false, data: null });
    }

    logger.info(`Invoice updated: ${id}`);
    res.status(200).json({
      message: "Invoice updated successfully",
      data: invoice,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Invoice update failed: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Invoice update failed", success: false, data: null });
  }
};

const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.error("Invoice deletion failed: Missing ID");
      return res
        .status(400)
        .json({ message: "Missing invoice ID", data: null, success: false });
    }

    const invoice = await deleteInvoiceService(id);

    if (!invoice) {
      logger.error(`Invoice not found for deletion: ${id}`);
      return res
        .status(404)
        .json({ message: "Invoice not found", data: null, success: false });
    }

    logger.info(`Invoice deleted: ${id}`);
    res.status(200).json({
      message: "Invoice deleted successfully",
      data: invoice,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Invoice deletion failed: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Invoice deletion failed", success: false, data: null });
  }
};

const currentMonthInvoices = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access to invoices");
      return res
        .status(401)
        .json({ message: "Unauthorized", data: null, success: false });
    }

    const userId = req.user._id;
    const invoices = await getAllInvoicesService(userId);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    if (invoices) {
      const currentMonthSalesInvoices = invoices.filter((invoice) => {
        const invoiceMonth = new Date(invoice.invoiceDate).getMonth();
        const invoiceYear = new Date(invoice.invoiceDate).getFullYear();
        return (
          invoiceMonth === currentMonth &&
          invoiceYear === currentYear &&
          invoice.type === "sale"
        );
      });

      const currentMonthPurchaseInvoices = invoices.filter((invoice) => {
        const invoiceMonth = new Date(invoice.invoiceDate).getMonth();
        const invoiceYear = new Date(invoice.invoiceDate).getFullYear();
        return (
          invoiceMonth === currentMonth &&
          invoiceYear === currentYear &&
          invoice.type === "purchase"
        );
      });

      logger.info(`Current Month invoices fetched for user: ${userId}`);

      res.status(200).json({
        message: "Invoices fetched successfully",
        data: {
          sales: currentMonthSalesInvoices,
          purchase: currentMonthPurchaseInvoices,
        },
        success: true,
      });
    }
  } catch (error: any) {
    logger.error(`Current Month invoice fetch failed: ${error.message}`);
    res.status(500).json({
      message: "Current month invoice Fetch failed",
      success: false,
      data: null,
    });
  }
};

const customerWiseInvoices = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access to invoices");
      return res
        .status(401)
        .json({ message: "Unauthorized", data: null, success: false });
    }

    const userId = req.user._id;
    const invoices = await getAllInvoicesService(userId);

    if (invoices && invoices.length > 0) {
      const customerInvoiceMap = new Map();

      invoices.forEach((invoice) => {
        const { customerId, customerName } = invoice;

        const idStr = customerId.toString();

        if (customerInvoiceMap.has(idStr)) {
          const customerData = customerInvoiceMap.get(idStr);
          customerInvoiceMap.set(idStr, {
            customerName: customerData.customerName,
            invoiceCount: customerData.invoiceCount + 1,
          });
        } else {
          customerInvoiceMap.set(idStr, {
            customerName: customerName,
            invoiceCount: 1,
          });
        }
      });

      const customerWiseInvoices = Array.from(
        customerInvoiceMap,
        ([customerId, customerData]) => ({
          customerId,
          customerName: customerData.customerName,
          invoiceCount: customerData.invoiceCount,
        })
      );

      logger.info(`Customer-wise invoices fetched for user: ${userId}`);

      return res.status(200).json({
        message: "Invoices fetched successfully",
        data: customerWiseInvoices,
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "No invoices found",
        data: null,
        success: false,
      });
    }
  } catch (error: any) {
    logger.error(`Customer-wise invoice fetch failed: ${error.message}`);
    return res.status(500).json({
      message: "Customer-wise invoice fetch failed",
      success: false,
      data: null,
    });
  }
};

const monthWiseInvoices = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access to invoices");
      return res
        .status(401)
        .json({ message: "Unauthorized", data: null, success: false });
    }

    const userId = req.user._id;
    const invoices = await getAllInvoicesService(userId);

    if (invoices && invoices.length > 0) {
      const monthInvoiceMap = new Map();

      invoices.forEach((invoice) => {
        const invoiceDate = new Date(invoice.invoiceDate);
        // this
        const monthYear = `${invoiceDate.getMonth()}`;

        if (monthInvoiceMap.has(monthYear)) {
          const monthData = monthInvoiceMap.get(monthYear);
          monthInvoiceMap.set(monthYear, {
            monthYear,
            invoiceCount: monthData.invoiceCount + 1,
          });
        } else {
          monthInvoiceMap.set(monthYear, {
            monthYear,
            invoiceCount: 1,
          });
        }
      });

      const monthWiseInvoices = Array.from(
        monthInvoiceMap,
        ([monthYear, monthData]) => ({
          monthYear,
          invoiceCount: monthData.invoiceCount,
        })
      );

      logger.info(`Month-wise invoices fetched for user: ${userId}`);

      return res.status(200).json({
        message: "Invoices fetched successfully",
        data: monthWiseInvoices,
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "No invoices found",
        data: null,
        success: false,
      });
    }
  } catch (error: any) {
    logger.error(`Month-wise invoice fetch failed: ${error.message}`);
    return res.status(500).json({
      message: "Month-wise invoice fetch failed",
      success: false,
      data: null,
    });
  }
};

export {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  currentMonthInvoices,
  customerWiseInvoices,
  monthWiseInvoices,
};
