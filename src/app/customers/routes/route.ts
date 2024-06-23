import { Router } from "express";
import {
    createCustomer,
    getCustomerByID,
    getAllCustomer,
    updateCustomer,
    deleteCustomer
} from '../controller/controller.js'

const router = Router();

router.post('/create', createCustomer);
router.get('/get/:id', getCustomerByID);
router.get('/get', getAllCustomer);
router.put('/update/:id', updateCustomer);
router.delete('/delete/:id', deleteCustomer);

export default router;