import { Request, Response } from "express";
import {
  createCustomerServices,
  getCustomerByIDServices,
  getAllCustomerServices,
  updateCustomerServices,
  deleteCustomerServices,
} from "../services/service.js";

const createCustomer = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const result = await createCustomerServices(data);
    res.status(201).send(result);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: "Error while creating customer" });
  }
};

const getCustomerByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await getCustomerByIDServices(id);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "Customer not found" });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: "Error while getting customer" });
  }
};

const getAllCustomer = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const userId = req.user._id;
    const result = await getAllCustomerServices(userId);
    res.status(200).send(result);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: "Error while getting all customers" });
  }
};

const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const result = await updateCustomerServices(id, data);
    if (result) {
      res
        .status(200)
        .send({ message: "Customer updated successfully", data: result });
    } else {
      res.status(404).send({ message: "Customer not found" });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: "Error while updating customer" });
  }
};

const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteCustomerServices(id);
    if (result) {
      res.status(200).send({ message: "Customer deleted successfully" });
    } else {
      res.status(404).send({ message: "Customer not found" });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: "Error while deleting customer" });
  }
};

export {
  createCustomer,
  getCustomerByID,
  getAllCustomer,
  updateCustomer,
  deleteCustomer,
};
