import mongoose from "mongoose";

enum paidCategory {
  GOLD = "GOLD",
  PLATINUM = "platinum",
  SILVER = "silver",
}

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  gstIN: {
    type: String,
    default: null,
  },
  dlNumber: {
    type: String,
    default: null,
  },
  customer: {
    type: [String],
    default: [],
  },
  paidCategory: {
    type: String,
    enum: Object.values(paidCategory),
  },
});

export default mongoose.model("User", User);
