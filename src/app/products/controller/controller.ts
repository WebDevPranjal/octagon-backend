import { Request, Response } from "express";
import {
  createProductService,
  getProductByIDService,
  getAllProductsService,
  updateProductService,
  deleteProductService,
  createBatchService,
} from "../services/service.js";

const createProduct = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    console.log(data);

    const result = await createProductService(data);
    //  console.log(result);
    res.status(200).send(result);
  } catch (error: any) {
    console.log(error.message);
    if (error.message === "Product already exists") {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send({ message: "Error while creating product" });
    }
  }
};

const getProductByID = async (req: Request, res: Response) => {
  try {
    const result = await getProductByIDService(req.params.id);
    res.status(200).send(result);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: "Error while getting product by ID" });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).send({ message: "Unauthorised" });
    }
    const userId = req.user._id;
    const result = await getAllProductsService(userId);
    res.status(200).send(result);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: "Error while getting all products" });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { data } = req.body;

    const result = await updateProductService(id, data);
    console.log(result);
    if (result === -1) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send(result);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: "Error while updating product" });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await deleteProductService(req.params.id);
    res.status(200).send(result);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: "Error while deleting product" });
  }
};

const addBatchToProduct = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const id = req.params.id;
    const result = await createBatchService(id, data);
    res.status(200).send(result);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: "Error while adding batch to product" });
  }
};

export {
  createProduct,
  getProductByID,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addBatchToProduct,
};
