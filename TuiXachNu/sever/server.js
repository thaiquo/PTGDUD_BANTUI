import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import dataHandler from "./api/data.js";
import loginHandler from "./api/login.js";
import registerHandler from "./api/register.js";
import addToCartHandler from "./api/addtocart.js";
import deleteCartHandler from "./api/deletecart.js";
import updateCartHandler from "./api/updatecart.js";
import getCartHandler from "./api/cart.js";
import createOrderHandler from "./api/create-order.js";
import getOrdersHandler from "./api/get-orders.js"; // Add this import

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API routes
app.get("/api/db.json", dataHandler);
app.post("/api/login", loginHandler);
app.post("/api/register", registerHandler);

// Cart routes
app.get("/api/cart/:userId", getCartHandler);
app.post("/api/addtocart/:userId", addToCartHandler);
app.delete("/api/deletecart/:userId", deleteCartHandler);
app.put("/api/updatecart/:userId", updateCartHandler);

// Order routes
app.post("/api/create-order", createOrderHandler);
app.get("/api/orders/:userId", getOrdersHandler); // Add this route

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`✅ API available at http://localhost:${PORT}/api`);
});