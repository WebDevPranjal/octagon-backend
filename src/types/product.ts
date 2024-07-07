import { ObjectId } from "mongoose";

export type BatchType = {
    _id?: ObjectId;
    name: string;
    quantity: number;
    expireDate: Date;
    packaging: string;
    mrp: number;
};

export type ProductType = {
    _id: ObjectId;
    name: string;
    hsn: string;
    gst: number;
    gstCategory: string;
    saleRate: number[];
    purchaseRate: number;
    companyName: string;
    batches: BatchType[];
    createdAt: Date;
    updatedAt: Date;
    user: ObjectId;
};