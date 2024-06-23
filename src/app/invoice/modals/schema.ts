import mongoose from "mongoose";

const InvoiceItems = new mongoose.Schema({
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
  },
  discount: {
    type: Number,
    required: true
  },
  free: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  invoicerate: {
    type: Number,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }
})


const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  type: {
    type: String,
    required: true,
  },
  items: [InvoiceItems],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

export default mongoose.model("Invoice", InvoiceSchema);
