import { InvoiceType } from "../../../types/invoice.js";
import {
  updateStockOnSale,
  updateStockOnPurchase,
  updateStockOnPurchaseOnDelete,
  updateStockOnSaleOnDelete,
} from "../../utils/update-stock.js";
import Invoice from "../modals/schema.js";
import Customer from "../../customers/modals/schema.js";
import Product from "../../products/modals/schema.js";
import { BatchType } from "../../../types/product.js";
import { createBatchService } from "../../products/services/service.js";
import mongoose from "mongoose";

const createInvoiceService = async (invoice: InvoiceType) => {
  const { type } = invoice;

  // for modifying items data in invoice
  let products = [];

  for (const item of invoice.items) {
    const { productId, batchId, free, quantity } = item;

    if (type === "sale" && batchId) {
      updateStockOnSale(productId, batchId, free, quantity);
    } else if (type === "purchase") {
      const batchData = {
        name: item.batch,
        quantity: 0,
        expireDate: item.expireDate,
        packaging: item.packaging,
        mrp: item.mrp,
      };

      try {
        const res: any = await createBatchService(String(productId), batchData);
        if (res) {
          const batchId = res.batchId;
          await updateStockOnPurchase(productId, batchId, free, quantity);
          const productData = {
            productId,
            batchId: batchId,
            free,
            quantity,
            rate: item.rate,
            discount: item.discount,
          };
          products.push(productData);
        }
      } catch (error) {
        throw new Error("Error while creating batch");
      }
    }
  }

  return await Invoice.create({
    items: products,
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.invoiceDate,
    customerId: invoice.customerId,
    type: invoice.type,
    user: invoice.user,
  });
};

const getAllInvoicesService = async (userId: string) => {
  try {
    const invoices = await Invoice.find({ user: userId });

    if (!invoices) {
      throw new Error("Invoices not found");
    }

    const data = [];
    let customerData: any;

    for (const invoice of invoices) {
      customerData = await Customer.findById(invoice.customerId);
      const itemsData: any = [];
      for (const item of invoice.items) {
        const product: any = await Product.findById(item.productId);

        if (!product) {
          throw new Error("Product not found");
        }

        const batch = product.batches.filter(() => {
          return product.batches._id === item.batchId;
        });

        if (!batch) {
          throw new Error("Batch not found");
        }

        itemsData.push({
          ...item,
          ...product,
          ...batch,
        });
      }

      data.push({
        _id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        type: invoice.type,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        customerName: customerData.name,
        customerMobile: customerData.phone,
        customerDl: customerData.dlNumber,
        customerGst: customerData.gstIN,
        customerId: invoice.customerId,
        itemsData,
      });
    }
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getInvoiceByIdService = async (id: string) => {
  try {
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const customerData = await Customer.findById(invoice.customerId);

    if (!customerData) {
      throw new Error("Customer not found");
    }

    const itemsData: any = [];
    for (const item of invoice.items) {
      const product: any = await Product.findById(item.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      const batch: BatchType = product.batches.filter((batch: BatchType) => {
        return String(batch._id) === String(item.batchId);
      })[0];

      //console.log("batch hai ye", batch);

      if (!batch) {
        throw new Error("Batch not found");
      }

      itemsData.push({
        quantity: item.quantity,
        free: item.free,
        rate: item.rate,
        discount: item.discount,
        name: product.name,
        productId: product._id,
        gst: product.gst,
        hsn: product.hsn,
        gstCategory: product.gstCategory,
        companyName: product.companyName,
        batch: batch.name,
        expireDate: batch.expireDate,
        packaging: batch.packaging,
        mrp: batch.mrp,
      });
    }

    const data = {
      _id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      type: invoice.type,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      customerName: customerData.name,
      customerMobile: customerData.phone,
      customerDl: customerData.dlNumber,
      customerGst: customerData.gstIN,
      customerId: invoice.customerId,
      items: itemsData,
    };

    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateInvoiceService = async (id: string, data: InvoiceType) => {
  const invoice = await Invoice.findById(id);

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const { type } = invoice;

  for (const item of invoice.items) {
    const { productId, batchId, free, quantity } = item;

    if (type === "sale") {
      await updateStockOnSaleOnDelete(
        String(productId),
        String(batchId),
        free,
        quantity
      );
    } else if (type === "purchase") {
      await updateStockOnPurchaseOnDelete(
        String(productId),
        String(batchId),
        free,
        quantity
      );
    }
  }

  for (const item of data.items) {
    const { productId, batchId, free, quantity } = item;

    let products = [];

    if (type === "sale" && batchId) {
      await updateStockOnSale(productId, batchId, free, quantity);
    } else if (type === "purchase") {
      const batchData = {
        name: item.batch,
        quantity: 0,
        expireDate: item.expireDate,
        packaging: item.packaging,
        mrp: item.mrp,
      };

      try {
        console.log("productId", productId);
        console.log("batchData", batchData);
        const res: any = await createBatchService(String(productId), batchData);
        console.log("res", res);
        if (res) {
          const batchId = res.batchId;
          await updateStockOnPurchase(productId, batchId, free, quantity);
          const productData = {
            productId,
            batchId: batchId,
            free,
            quantity,
            invoicerate: item.rate,
            discount: item.discount,
          };
          products.push(productData);
        }
      } catch (error) {
        throw new Error("Error while creating batch");
      }
    }
  }

  invoice.invoiceDate = data.invoiceDate;
  invoice.invoiceNumber = data.invoiceNumber;
  invoice.customerId = new mongoose.Types.ObjectId(data.customerId);
  console.log(...data.items);
  invoice.items = [...data.items];

  return await invoice.save();
};

const deleteInvoiceService = async (id: string) => {
  const invoice = await Invoice.findById(id);

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const { type } = invoice;

  for (const item of invoice.items) {
    const { productId, batchId, free, quantity } = item;

    if (type === "sale") {
      updateStockOnSaleOnDelete(
        String(productId),
        String(batchId),
        free,
        quantity
      );
    } else if (type === "purchase") {
      updateStockOnPurchaseOnDelete(
        String(productId),
        String(batchId),
        free,
        quantity
      );
    }
  }

  return await Invoice.findByIdAndDelete(id);
};

export {
  createInvoiceService,
  getAllInvoicesService,
  getInvoiceByIdService,
  updateInvoiceService,
  deleteInvoiceService,
  createBatchService,
};
