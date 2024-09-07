import { ClientSession, ObjectId } from "mongoose";
import Product from "../products/modals/schema.js";

const updateStockOnSale = async (
  productId: ObjectId,
  batchId: ObjectId,
  free: number,
  quantity: number,
  session: ClientSession
) => {
  const product = await Product.findById(productId).session(session);

  if (!product) {
    throw new Error("Product not found");
  }

  product.batches.find((item) => {
    if (item._id && item._id.equals(String(batchId))) {
      item.quantity = item.quantity - Number(quantity) - Number(free);
    }
  });

  return await product.save();
};

const updateStockOnPurchase = async (
  productId: ObjectId,
  batchId: string,
  free: number,
  quantity: number,
  session: ClientSession
) => {
  const product = await Product.findById(productId).session(session);

  if (!product) {
    throw new Error("Product not found");
  }

  product.batches.find((item) => {
    if (item._id && item._id.equals(String(batchId))) {
      item.quantity = item.quantity + Number(quantity) + Number(free);
    }
  });

  return await product.save({ session });
};

const updateStockOnSaleOnDelete = async (
  productId: string,
  batchId: string,
  free: number,
  quantity: number,
  session: ClientSession
) => {
  const product = await Product.findById(productId).session(session);

  if (!product) {
    throw new Error("Product not found");
  }

  let batch: any = {};

  product.batches.find((item) => {
    if (item._id && item._id.equals(String(batchId))) {
      batch = item;
    }
  });

  if (!batch) {
    throw new Error("Batch not found");
  }

  batch.quantity = batch.quantity + Number(quantity) + Number(free);

  return await product.save({ session });
};

const updateStockOnPurchaseOnDelete = async (
  productId: string,
  batchId: string,
  free: number,
  quantity: number,
  session: ClientSession
) => {
  const product = await Product.findById(productId).session(session);

  if (!product) {
    throw new Error("Product not found");
  }

  let batch: any = {};

  product.batches.find((item) => {
    if (item._id && item._id.equals(String(batchId))) {
      batch = item;
    }
  });

  if (!batch) {
    throw new Error("Batch not found");
  }

  batch.quantity = batch.quantity - Number(quantity) - Number(free);

  return await product.save({ session });
};

export {
  updateStockOnSale,
  updateStockOnPurchase,
  updateStockOnSaleOnDelete,
  updateStockOnPurchaseOnDelete,
};
