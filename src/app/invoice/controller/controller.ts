import { Request, Response } from "express"
import { createInvoiceService, getAllInvoicesService, getInvoiceByIdService, deleteInvoiceService } from "../services/service.js";

const createInvoice = async (req: Request, res: Response) => {
    try{
        const { data } = req.body;
        const invoice = createInvoiceService(data);
        res.status(201).json({ msg: "Invoice created", data: invoice });
    }catch(error){
        console.log(error);
        res.status(400).json({ msg: "Error while creating invoice"});
    }
}

const getAllInvoices = async (req: Request, res: Response) => {
    try{
        const invoices = getAllInvoicesService();
        res.status(200).json({ data: invoices });
    }catch(error){
        console.log(error);
        res.status(400).json({ msg: "Error while fetching invoices"});
    }
}

const getInvoiceById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const invoice = getInvoiceByIdService(id);
        res.status(200).json({ data: invoice });
    }catch(error){
        console.log(error);
        res.status(400).json({ msg: "Error while fetching invoice"});
    }
}

const updateInvoice = async (req: Request, res: Response) => {
}

const deleteInvoice = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const invoice = deleteInvoiceService(id);
        res.status(200).json({ msg: "Invoice deleted", data: invoice });
    }catch(error){
        console.log(error);
        res.status(400).json({ msg: "Error while deleting invoice"});
    }
}

export {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
}