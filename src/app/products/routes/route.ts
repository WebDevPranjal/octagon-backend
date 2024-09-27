import { Router } from "express";
import {
  createProduct,
  getProductByID,
  getAllProducts,
  updateProduct,
  deleteProduct,
  // addBatchToProduct,
} from "../controller/controller.js";

const router = Router();

router.get("/get", getAllProducts);
router.get("/get/:id", getProductByID);
router.post("/create", createProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);
//router.put("/createBatch/:id", addBatchToProduct);

export default router;
