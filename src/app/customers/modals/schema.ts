import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  address: {
    type: String,
  },
  stateCode: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  dlNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  gstIN: {
    type: String,
    unqiue: true,
    sparse: true,
  },
  category: {
    type: String,
    enum: ["creditor", "debtor"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  amountPending: {
    type: Number,
  },
  user: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Customer", customerSchema);
