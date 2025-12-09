import express from "express";
import Customer from "../models/Customer.js";

const router = express.Router();

// GET /api/customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().limit(100); // aap filters aur pagination add kar sakte ho
    res.json({ data: customers, total: customers.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
