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
import { userAuth } from "./app/middlewares/authorise.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

databaseConnect();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  return res.json({ message: "Welcome to octagon backend" });
});

app.use(userAuth);

app.use("/api/customer", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoice", inoviceRoutes);
app.use("/api/user", userRoutes);
app.use("/", authRotes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
