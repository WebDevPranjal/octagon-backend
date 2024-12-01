import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import databaseConnect from "./config/db.js";
import dotenv from "dotenv";
import customerRoutes from "./app/customers/routes/route.js";
import productRoutes from "./app/products/routes/route.js";
import inoviceRoutes from "./app/invoice/routes/route.js";
import userRoutes from "./app/users/routes/route.js";
import authRotes from "./app/auth/rotues/route.js";
import reportRoutes from "./app/reports/route.js";
import { userAuth } from "./app/middlewares/authorise.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

databaseConnect();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://octagon-frotend-w8pz.vercel.app/",
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  return res.json({ message: "chai pee lo" });
});
app.use("/", authRotes);
app.use("/api/customer", userAuth, customerRoutes);
app.use("/api/products", userAuth, productRoutes);
app.use("/api/invoice", userAuth, inoviceRoutes);
app.use("/api/user", userAuth, userRoutes);
app.use("/api/report", userAuth, reportRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
