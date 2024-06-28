import { Request, Response } from 'express';
import { deleteUserService, updateUserService } from '../services/service.js';

const updateUser = async (req : Request, res : Response) => {
    try{
        const {id} = req.params;
        const data = req.body;

        const user = updateUserService(id, data);
        res.status(200).json({msg : 'User updated', data : user});
    }catch(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}

const deleteUser = async (req : Request, res : Response) => {
    try{
        const {id} = req.params;
        const user = deleteUserService(id);
        res.status(200).json({msg : 'User deleted', data : user});
    }catch(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}

export {
    updateUser,
    deleteUser
}