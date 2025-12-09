import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import customerRoutes from "./routes/customerRoutes.js";
import mongoose from "mongoose";

// Explicitly load .env from backend root (parent of src)
dotenv.config({ path: path.join(process.cwd(), ".env") });



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/customers", customerRoutes);

app.get("/", (req, res) => {
  res.send("TruEstate Backend Running");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));

