import Product from "../app/products/modals/schema.js";
import { Request, Response } from "express";

type Data = {
  name: string;
  quantity: number;
};

export const StockReport = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    let stock = 0;
    let data: Data[] = [];

    for (const product of products) {
      for (const batch of product.batches) {
        stock += batch.quantity;
      }
      data.push({
        name: product.name,
        quantity: stock,
      });
      stock = 0;
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};