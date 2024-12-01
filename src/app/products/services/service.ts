import { ClientSession } from "mongoose";
import { BatchType, ProductType } from "../../../types/product.js";
import Product from "../modals/schema.js";
import Invoice from "../../invoice/modals/schema.js";

const createProductService = async (product: ProductType) => {
  const name = product.name;

  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    throw new Error("Product already exists");
  }

  const newProduct = await Product.create(product);
  return newProduct;
};

const getProductByIDService = async (id: string) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return new Error("Product not found");
    }
    return product;
  } catch (error: any) {
    throw error;
  }
};

const getAllProductsService = async (userId: string) => {
  try {
    return await Product.find({ user: userId });
  } catch (error) {
    throw error;
  }
};

const updateProductService = async (id: string, product: ProductType) => {
  try {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return -1;
    }
    const data = { ...product, updatedAt: new Date() };
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

const deleteProductService = async (id: string, userId: string) => {
  try {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return new Error("Product not found");
    }
    console.log("Product found");
    const userInvoices = await Invoice.find({ user: userId });
    const items = userInvoices.flatMap((invoice) => invoice.items);
    console.log("Items found");

    const productExists = items.some(
      (item) => item.productId.toString() === id
    );

    if (productExists) {
      return new Error("Product is associated with an invoice");
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct;
  } catch (error) {
    throw error;
  }
};

const createBatchService = async (
  id: string,
  batch: BatchType,
  session: ClientSession
) => {
  try {
    const existingProduct = await Product.findOne({ _id: id }).session(session);

    if (!existingProduct) {
      return new Error("Product not found");
    }

    existingProduct.batches.push(batch);
    existingProduct.updatedAt = new Date();
    const updatedProduct = await existingProduct.save({ session });
    const batchId =
      updatedProduct.batches[updatedProduct.batches.length - 1]._id;
    return { updatedProduct, batchId };
  } catch (error) {
    throw error;
  }
};

export {
  createProductService,
  getProductByIDService,
  getAllProductsService,
  updateProductService,
  deleteProductService,
  createBatchService,
};
