import { ObjectId } from "mongoose";

export type InvoiceItemsType = {
  batchId: ObjectId;
  discount: number;
  free: number;
  quantity: number;
  invoicerate: number;
  productId: ObjectId;
}

export type InvoiceType = {
  invoiceNumber: string;
  invoiceDate: Date;
  customerId: string;
  type: string;
  items: InvoiceItemsType[];
  createdAt: Date;
  updatedAt: Date;
}
