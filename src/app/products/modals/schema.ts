import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
    batch: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    expireDate: {
        type: Date,
        required: true
    },
    packaging: {
        type: String,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gst: {
        type: Number,
        required: true
    },
    hsn: {
        type: Number,
        required: true
    },
    gstCategory: {
        type: String,
        required: true
    },
    purchaseRate: {
        type: Number
    },
    saleRate: {
        type: Number
    },
    companyName: {
        type: String,
        required: true
    },
    batches: [batchSchema]
});

const Product = mongoose.model('Product', productSchema);

export default Product;
