export type BatchType = {
    batch: string;
    quantity: number;
    expireDate: Date;
    packaging: string;
    mrp: number;
};

export type ProductType = {
    name: string;
    hsn: string;
    gst: number;
    gstCategory: string;
    saleRate: number;
    purchaseRate: number;
    companyName: string;
    batches: BatchType[];
};