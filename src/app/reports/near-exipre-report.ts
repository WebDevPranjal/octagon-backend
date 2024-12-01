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
    const userId = req?.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized", data: null, success: false });
    }

    const allProducts = await Product.find({ user: userId });
    const nearExpireProducts: Product[] = [];

    for (const product of allProducts) {
      product.batches.filter((batch) => {
        if (
          batch.expireDate < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) &&
          batch.quantity > 0
        ) {
          nearExpireProducts.push({
            name: product.name,
            batchName: batch.name,
            expiryDate: batch.expireDate,
          });
        }
      });
    }

    return res.status(200).json({
      data: nearExpireProducts,
      success: true,
      message: "Near expire report generated successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", data: null, success: false });
  }
};
