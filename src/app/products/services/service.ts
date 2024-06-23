import { BatchType, ProductType } from "../../../types/product.js"
import Product from "../modals/schema.js"

const createProductService = async (product: ProductType) => {
    const name = product.name;

    const existingProduct = await Product.findOne({ name });
    if(existingProduct) {
        throw new Error('Product already exists');
    }

    const newProduct = await Product.create(product);
    return newProduct;
}

const getProductByIDService = async (id: string) => {
    try {
        const product = await Product.findById(id);
        if(!product) {
            return new Error('Product not found');
        }
        return product;
    }catch(error : any){
        throw error;
    }
}

const getAllProductsService = async () => {
    try {
        return await Product.find({});
    }catch(error){
        throw error;
    }
}

const updateProductService = (id: string, product: ProductType) => {
    try{
        const existingProduct = Product.findById(id);
        if(!existingProduct){
            return -1;
        }
        const updatedProduct = Product.findByIdAndUpdate(id, product, {new: true});
        return updatedProduct;
    }catch(error){
        throw error;
    }
}

const deleteProductService = (id: string) => {
    try{
        const existingProduct = Product.findById(id);
        if(!existingProduct){
            return new Error('Product not found');
        }
        const deletedProduct = Product.findByIdAndDelete(id);
        return deletedProduct;
    }catch(error){
        throw error;
    }
}

const createBatchService = async (id: string, batch: BatchType) => {
    try{
        const existingProduct = await Product.findById(id);
        if(!existingProduct){
            return new Error('Product not found');
        }
        existingProduct.batches.push(batch);
        const updatedProduct = await existingProduct.save();
        return updatedProduct;
    }catch(error){
        throw error;
    }
}

export {
    createProductService,
    getProductByIDService,
    getAllProductsService,
    updateProductService,
    deleteProductService,
    createBatchService
}