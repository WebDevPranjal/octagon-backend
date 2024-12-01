import { Response, Request } from "express";
import Product from "../products/modals/schema.js";

const productList = async (req: Request, res: Response) => {
  try {
    const userId = req?.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized", data: null, success: false });
    }
    const products = await Product.find({ user: userId });

    res
      .status(200)
      .json({ message: "Products fetched", data: products, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export { productList };
