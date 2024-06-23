import { ObjectId } from "mongoose";
import Product from "../products/modals/schema.js"

const updateStockOnSale = async (productId: ObjectId, batchId: ObjectId, free: Number, quantity: Number) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }


  product.batches.forEach((item) => {
    if (item._id && item._id.equals(batchId)) {
      item.quantity = item.quantity - Number(quantity) - Number(free);
    }
  });

  return await product.save();
}

const updateStockOnPurchase = async (productId: ObjectId, batchId: ObjectId, free: Number, quantity: Number) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  product.batches.forEach((item) => {
    if (item._id && item._id.equals(batchId)) {
      item.quantity = item.quantity + Number(quantity) + Number(free);
    }
  });

  return await product.save();
}

const updateStockOnSaleOnDelete = async (productId: ObjectId, batchId: ObjectId, free: Number, quantity: Number) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  product.batches.forEach((item) => {
    if (item._id && item._id.equals(batchId)) {
      item.quantity = item.quantity + Number(quantity) + Number(free);
    }
  });

  return await product.save();
}

const updateStockOnPurchaseOnDelete = async (productId: ObjectId, batchId: ObjectId, free: Number, quantity: Number) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  product.batches.forEach((item) => {
    if (item._id && item._id.equals(batchId)) {
      item.quantity = item.quantity - Number(quantity) - Number(free);
    }
  });

  return await product.save();
}

export {
  updateStockOnSale,
  updateStockOnPurchase,
  updateStockOnSaleOnDelete,
  updateStockOnPurchaseOnDelete
}
