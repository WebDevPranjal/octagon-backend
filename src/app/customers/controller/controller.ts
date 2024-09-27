import { Request, Response } from "express";
import {
  createCustomerServices,
  getCustomerByIDServices,
  getAllCustomerServices,
  updateCustomerServices,
  deleteCustomerServices,
} from "../services/service.js";
import logger from "../../utils/logger.js";

const createCustomer = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const result = await createCustomerServices(data);

    logger.info(`Customer created: ${result?.name}`);

    res.status(201).json({
      message: "Customer created successfully",
      data: result,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Customer creation failed: ${error.message}`);

    res.status(500).send({
      message: "Error while creating customer",
      success: false,
      data: null,
    });
  }
};

const getCustomerByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await getCustomerByIDServices(id);

    if (result) {
      logger.info(`Customer fetched: ${result?.name}`);
      res.status(200).json({
        message: "Customer fetched successfully",
        data: result,
        success: true,
      });
    } else {
      logger.error("Customer not found");
      res
        .status(404)
        .send({ message: "Customer not found", success: false, data: null });
    }
  } catch (error: any) {
    logger.error(`Customer fetch failed: ${error.message}`);

    res.status(500).send({
      message: "Error while getting customer",
      success: false,
      data: null,
    });
  }
};

const getAllCustomer = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access to customers");
      return res
        .status(401)
        .send({ message: "Unauthorized", data: null, success: false });
    }
    const userId = req.user._id;
    const result = await getAllCustomerServices(userId);

    logger.info(`Customers fetched for user: ${userId}`);

    res.status(200).json({
      message: "Customers fetched successfully",
      data: result,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Customer fetch failed: ${error.message}`);

    res.status(500).json({
      message: "Error while getting all customers",
      success: false,
      data: null,
    });
  }
};

const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    const result = await updateCustomerServices(id, data);

    if (result) {
      logger.info(`Customer updated: ${result?.name}`);
      res.status(200).send({
        message: "Customer updated successfully",
        data: result,
        success: true,
      });
    } else {
      logger.error("Customer not found");
      res
        .status(404)
        .send({ message: "Customer not found", success: false, data: null });
    }
  } catch (error: any) {
    logger.error(`Customer update failed: ${error.message}`);

    res.status(500).send({
      message: "Error while updating customer",
      success: false,
      data: null,
    });
  }
};

const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteCustomerServices(id);

    if (result) {
      logger.info(`Customer deleted: ${result?.name}`);
      res.status(200).json({
        message: "Customer deleted successfully",
        data: result,
        success: true,
      });
    } else {
      logger.error("Customer not found");
      res
        .status(404)
        .send({ message: "Customer not found", success: false, data: null });
    }
  } catch (error: any) {
    logger.error(`Customer deletion failed: ${error.message}`);

    res.status(500).send({
      message: "Error while deleting customer",
      success: false,
      data: null,
    });
  }
};

export {
  createCustomer,
  getCustomerByID,
  getAllCustomer,
  updateCustomer,
  deleteCustomer,
};
