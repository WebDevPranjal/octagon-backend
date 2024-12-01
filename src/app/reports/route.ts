import express from "express";
import { stockReport } from "./stock-report.js";
import { nearExpireReport } from "./near-exipre-report.js";
import { itemWiseReport } from "./item-wise-report.js";
import { productList } from "./product-list.js";

const router = express();

router.get("/stock-report", stockReport);
router.get("/near-expire-report", nearExpireReport);
router.get("/item-wise-report", itemWiseReport);
router.get("/product-list", productList);

export default router;
