// @ts-nocheck
import Product from "../products/modals/schema.js";
import { Request, Response } from "express";

type Product = {
  name: string;
  batchId: string;
  expiryDate: Date;
};

export const nearExpireReport = async (req: Request, res: Response) => {
  try {
    const allProducts = await Product.find();
    const nearExpireProducts: Product[] = [];

    for (const product of allProducts) {
      product.batches.filter((batch) => {
        if (
          batch.expireDate < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        ) {
          nearExpireProducts.push({
            name: product.name,
            batchId: batch._id,
            expiryDate: batch.expireDate,
          });
        }
      });
    }

    return res.status(200).json(nearExpireProducts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
