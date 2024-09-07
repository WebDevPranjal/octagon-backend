import express from "express";
import { stockReport } from "./stock-report.js";
import { nearExpireReport } from "./near-exipre-report.js";

const router = express();

router.get("/stock-report", stockReport);
router.get("/near-expire-report", nearExpireReport);

export default router;
