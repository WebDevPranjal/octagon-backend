import { Request, Response } from "express";
import {
  createProductService,
  getProductByIDService,
  getAllProductsService,
  updateProductService,
  deleteProductService,
} from "../services/service.js";
import logger from "../../utils/logger.js";

const createProduct = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const result = await createProductService(data);

    logger.info(`Product created: ${result?.name}`);

    res.status(200).json({
      message: "Product created successfully",
      data: result,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Product creation failed: ${error.message}`);

    if (error.message === "Product already exists") {
      res.status(400).send({
        message: "Product already exists",
        success: false,
        data: null,
      });
    } else {
      res.status(500).send({
        message: "Error while creating product",
        success: false,
        data: null,
      });
    }
  }
};

const getProductByID = async (req: Request, res: Response) => {
  try {
    const result = await getProductByIDService(req.params.id);

    logger.info(`Product fetched: ${result?.name}`);

    res.status(200).json({
      message: "Product fetched successfully",
      data: result,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Product fetch failed: ${error.message}`);

    res.status(500).send({
      message: "Error while getting product by ID",
      success: false,
      data: null,
    });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access to products");
      return res
        .status(401)
        .json({ message: "Unauthorized access", data: null, success: false });
    }

    const userId = req.user._id;
    const result = await getAllProductsService(userId);

    logger.info(`Products fetched for user: ${userId}`);

    res
      .status(200)
      .json({ message: "All products fetched", data: result, success: true });
  } catch (error: any) {
    logger.error(`Product fetch failed: ${error.message}`);

    res.status(500).send({
      message: "Error while getting all products",
      success: false,
      data: null,
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { data } = req.body;

    const result = await updateProductService(id, data);

    if (result === -1) {
      return res
        .status(404)
        .send({ message: "Product not found", success: false, data: null });
    }

    logger.info(`Product updated: ${result?.name}`);
    res.status(200).json({
      message: "Product updated successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Product update failed: ${error.message}`);

    res.status(500).send({
      message: "Error while updating product",
      success: false,
      data: null,
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access to products");
      return res
        .status(401)
        .json({ message: "Unauthorized access", data: null, success: false });
    }

    const result = await deleteProductService(req.params.id, req.user._id);

    if (result instanceof Error) {
      logger.error(`Product delete failed: ${result.message}`);
      return res.status(500).send({
        message: "Product is already exists in invoice",
        success: false,
        data: null,
      });
    }

    logger.info(`Product deleted: ${result?.name}`);
    res.status(200).json({
      message: "Product deleted successfully",
      data: result,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Product delete failed: ${error.message}`);
    res.status(500).send({
      message: "Error while deleting product",
      success: false,
      data: null,
    });
  }
};

export {
  createProduct,
  getProductByID,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
