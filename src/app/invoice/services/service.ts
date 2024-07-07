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
            invoicerate: item.purchaseRate,
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

    const data = [];
    let customerData : any;

    for (const invoice of invoices) {
      customerData = await Customer.findById(invoice.customerId);
      const itemsData: any = [];
      for (const item of invoice.items) {
        const product : any = await Product.findById(item.productId);

        if (!product) {
          throw new Error("Product not found");
        }

        const batch = product.batches.filter(() => {
          return product.batches._id === item.batchId
        })

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
    invoice.items.forEach((item) => {
      const product = Product.findById(item.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      const batch = product.find(
        (batch: BatchType) => String(batch._id) === String(item.batchId)
      );

      if (!batch) {
        throw new Error("Batch not found");
      }

      itemsData.push({
        ...item,
        ...product,
        ...batch,
      });
    });

    const data = {
      ...invoice,
      ...customerData,
      ...itemsData,
    };

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

  for (const item of data.items) {
    const { productId, batchId, free, quantity } = item;

    if (type === "sale" && batchId) {
      updateStockOnSale(productId, batchId, free, quantity);
    } else if (type === "purchase" && batchId) {
      updateStockOnPurchase(productId, String(batchId), free, quantity);
    }
  }

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
