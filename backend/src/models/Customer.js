import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  customerId: Number,
  customerName: String,
  phoneNumber: String,
  customerRegion: String,
  gender: String,
  age: Number,
  customerType: String,
  date: Date,
  quantity: Number,
  pricePerUnit: Number,
  discount: Number,
  totalAmount: Number,
  finalAmount: Number,
  paymentMethod: String,
  orderStatus: String,
  deliveryType: String,
  storeId: String,
  storeLocation: String,
  employeeName: String,
  productCategory: String,
  tags: [String],
});

export default mongoose.model("Customer", CustomerSchema);
