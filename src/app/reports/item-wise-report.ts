import { Request, Response } from "express";
import Invoice from "../invoice/modals/schema.js";
import Product from "../products/modals/schema.js";

type Product = {
  name: string;
  quantity: number;
};

export const itemWiseReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, type } = req.body;
    const requriredInvoice = await Invoice.find({
      invoiceDate: { $gte: startDate, $lte: endDate },
      type: type,
    });

    // -> Filter the products from the invoices
    // -> Calculate the total quantity and total amount
    // -> Calculate the total quantity (current) for each product
    // -> return the response

    let products: Product[] = [];

    for (const invoice of requriredInvoice) {
      for (const item of invoice.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error("Product not found");
        }

        const alreadyExist = products.find((p) => p.name === product.name);

        if (alreadyExist) {
          alreadyExist.quantity += item.quantity + item.free;
        } else {
          products.push({
            name: product.name,
            quantity: item.quantity + item.free,
          });
        }
      }
    }

    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
