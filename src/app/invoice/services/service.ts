import { InvoiceItemsType, InvoiceType } from "../../../types/invoice.js";
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
import mongoose, { Types } from "mongoose";
import logger from "../../utils/logger.js";

const createInvoiceService = async (invoice: InvoiceType) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { type } = invoice;
    let products = [];

    for (const item of invoice.items) {
      const { productId, batch, free, quantity } = item;

      if (type === "sale" && batch) {
        await updateStockOnSale(productId, batch, free, quantity, session);
        const productData = {
          productId,
          batchId: batch,
          free,
          quantity,
          rate: item.rate,
          discount: item.discount,
        };
        products.push(productData);
      } else if (type === "purchase") {
        const batchData = {
          name: item.batch,
          quantity: 0,
          expireDate: item.expireDate,
          packaging: item.packaging,
          mrp: item.mrp,
        };

        try {
          const res: any = await createBatchService(
            String(productId),
            batchData,
            session
          );
          if (res) {
            const batchId = res.batchId;
            await updateStockOnPurchase(
              productId,
              batchId,
              free,
              quantity,
              session
            );
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

    const newInvoice = await Invoice.create(
      [
        {
          items: products,
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.invoiceDate,
          customerId: invoice.customerId,
          type: invoice.type,
          user: invoice.user,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return newInvoice[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    logger.error(`Error creating invoice: ${error.message}`);
    throw new Error("Error while creating invoice");
  }
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
        customerStateCode: customerData?.stateCode || "",
        customerAddress: customerData?.address || "",
        customerMobile: customerData?.phone || "",
        customerDl: customerData.dlNumber,
        customerGst: customerData?.gstIN || "",
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
        batchId: batch._id,
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
      customerMobile: customerData?.phone || "",
      customerDl: customerData.dlNumber,
      customerGst: customerData?.gstIN || "",
      customerAddress: customerData?.address || "",
      customerStateCode: customerData?.stateCode || "",
      customerId: invoice.customerId,
      items: itemsData,
    };

    // console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateInvoiceService = async (id: string, data: InvoiceType) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invoice = await Invoice.findById(id).session(session);

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
          quantity,
          session
        );
        console.log("product old stock updated");
      } else if (type === "purchase") {
        await updateStockOnPurchaseOnDelete(
          String(productId),
          String(batchId),
          free,
          quantity,
          session
        );
      }
    }
    let products = [];
    // console.log(data);
    for (let item of data.items) {
      const { productId, batch, free, quantity } = item;

      if (type === "sale" && batch) {
        //console.log(productId, batch, free, quantity);
        await updateStockOnSale(productId, batch, free, quantity, session);
        const batchId = new mongoose.Types.ObjectId(batch);
        const productData = {
          productId,
          batchId,
          free,
          quantity,
          rate: item.rate,
          discount: item.discount,
        };
        products.push(productData);
      } else if (type === "purchase") {
        const batchData = {
          name: item.batch,
          quantity: 0,
          expireDate: item.expireDate,
          packaging: item.packaging,
          mrp: item.mrp,
        };

        try {
          const res: any = await createBatchService(
            String(productId),
            batchData,
            session
          );

          if (res) {
            const batchId = res.batchId;
            await updateStockOnPurchase(
              productId,
              batchId,
              free,
              quantity,
              session
            );
            const productData = {
              productId,
              batchId,
              free,
              quantity,
              rate: item.rate,
              discount: item.discount,
            };
            products.push(productData);
            item.batchId = batchId;
          }
        } catch (error) {
         // console.log(error);
          throw new Error("Error while creating batch");
        }
      }
    }

    invoice.invoiceDate = data.invoiceDate;
    invoice.invoiceNumber = data.invoiceNumber;
    invoice.customerId = new mongoose.Types.ObjectId(data.customerId);
    invoice.updatedAt = new Date();

    invoice.items = new mongoose.Types.DocumentArray(products);

    //console.log("iam reahing here");

    const updatedInvoice = await invoice.save({ session });
    await session.commitTransaction();
    session.endSession();

    // console.log(updatedInvoice);
    return updatedInvoice;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    logger.error(`Error updating invoice: ${error.message}`);
    throw new Error("Error while updating invoice");
  }
};

const deleteInvoiceService = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invoice = await Invoice.findById(id).session(session);

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
          quantity,
          session
        );
      } else if (type === "purchase") {
        updateStockOnPurchaseOnDelete(
          String(productId),
          String(batchId),
          free,
          quantity,
          session
        );
      }
    }

    const deletedInvoice = await Invoice.findByIdAndDelete(id, { session });
    await session.commitTransaction();
    session.endSession();
    logger.info(`Invoice deleted: ${id}`);

    return deletedInvoice;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    logger.error(`Error deleting invoice: ${error.message}`);
    throw new Error("Error while deleting invoice");
  }
};

export {
  createInvoiceService,
  getAllInvoicesService,
  getInvoiceByIdService,
  updateInvoiceService,
  deleteInvoiceService,
  createBatchService,
};
