import Customer from '../modals/schema.js';
import { customerType } from '../../../types/customer.js';

const createCustomerServices = async (customer : customerType) => {
    try {
        return await Customer.create(customer);
    }catch(error){
        throw error;
    }
}

const getCustomerByIDServices = async (id : String) => {
    try {
        const customer = await Customer.findById(id);
        if(!customer){
            throw new Error('Customer not found');
        }
        return customer;
    }catch(error){
        throw error;
    }  
}

const getAllCustomerServices = async () => {
    try {
        return await Customer.find();
    }catch(error){
        throw error;
    }
}

const updateCustomerServices = async (id : String, data : customerType) => {
    try {
        const customer = await Customer.findById(id);
        if(!customer){
            throw new Error('Customer not found');
        }
        const updatedData = {...data, updatedAt: new Date() , createdAt: customer.createdAt};
        return await Customer.findByIdAndUpdate(id, updatedData, {new: true});
    }catch(error){
        throw error;
    }
}

const deleteCustomerServices = async (id : String) => {
    try {
        const customer = await Customer.findById(id);
        if(!customer){
            throw new Error('Customer not found');
        }
        return await Customer.findByIdAndDelete(id);
    }catch(error){
        throw error;
    }
}

export { 
    createCustomerServices,
    getCustomerByIDServices,
    getAllCustomerServices,
    updateCustomerServices,
    deleteCustomerServices
};