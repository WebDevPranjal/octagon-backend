import { InvoiceType } from "../../../types/invoice.js"
import { updateStockOnSale, updateStockOnPurchase, updateStockOnPurchaseOnDelete, updateStockOnSaleOnDelete } from "../../utils/update-stock.js"
import Invoice from "../modals/schema.js"
import Customer from "../../customers/modals/schema.js"
import Product from "../../products/modals/schema.js"
import { BatchType } from "../../../types/product.js"
import { ProductType } from "../../../types/product.js"

const createInvoiceService = async (invoice: InvoiceType) => {
  const { type } = invoice;

  for (const item of invoice.items) {
    const { productId, batchId, free, quantity } = item;

    if (type === "sale") {
      updateStockOnSale(productId, batchId, free, quantity);
    } else if (type === "purchase") {
      updateStockOnPurchase(productId, batchId, free, quantity);
    }
  }

  return await Invoice.create(invoice);
}

const getAllInvoicesService = async () => {
  try {
    const invoices = await Invoice.find({});
    const data = [];
    let customerData;

    for (const invoice of invoices) {
      customerData = await Customer.findById(invoice.customerId);
      const items: any = [];
      invoice.items.forEach((item) => {
        const product = Product.findById(item.productId);
        const batch = product.find((batch : BatchType) => batch._id === item.batchId);
        items.push({
          ...item,
          productName: product.name,
          gst: product.gst,
          hsn: product.hsn,
          batchName: batch.batch,
          batchExpiry: batch.expireDate
        })
      })

      data.push({
        ...invoice,
        customerName: customerData.name,
        items: items
      })
    }

    return data;
  } catch (error) {
    console.log(error);
  }
}

const getInvoiceByIdService = async (id: string) => {
  try {
    const invoice = Invoice.findById(id);
    return invoice;
  } catch (error) {
    console.log(error);
  }
}

const updateInvoiceService = async (invoice: InvoiceType) => {
}

const deleteInvoiceService = async (id: string) => {
  try {
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const type = invoice.type;

    for (const item of invoice.items) {
      const { productId, batchId, free, quantity } = item;

      if (type === "sale") {
        updateStockOnPurchaseOnDelete(productId, batchId, free, quantity);
      } else if (type === "purchase") {
        updateStockOnSaleOnDelete(productId, batchId, free, quantity);
      }
    }

  } catch (error) {
    console.log(error);
  }
}

export {
  createInvoiceService,
  getAllInvoicesService,
  getInvoiceByIdService,
  updateInvoiceService,
  deleteInvoiceService
}
