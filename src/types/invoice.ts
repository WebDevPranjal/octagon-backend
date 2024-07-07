import { ObjectId } from "mongoose";

export type InvoiceItemsType = {
  batchId?: ObjectId;
  batch: string;
  discount: number;
  name: string;
  expireDate: Date;
  packaging: string;
  mrp: number;
  free: number;
  quantity: number;
  purchaseRate?: number;
  saleRate?: number;
  productId: ObjectId;
}

export type InvoiceType = {
  invoiceNumber: string;
  invoiceDate: Date;
  customerId: string;
  type: string;
  items: InvoiceItemsType[];
  user: string;
}
