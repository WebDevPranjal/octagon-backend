import express from 'express';
import { updateUser, deleteUser } from '../controller/controller.js';

const router = express.Router();

router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


export default router;