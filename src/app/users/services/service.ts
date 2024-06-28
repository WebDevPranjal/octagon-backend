import { UserType } from "../../../types/user.js";
import User from "../modals/modal.js";

const updateUserService = async (id: string, user: UserType) => {
    try {
        const updatedUser = await User.findById(id);
        if (!updatedUser) {
            throw new Error('User not found');
        }
        const data = { ...user, updatedAt: Date.now() };
        await updatedUser.updateOne(data);

        return updatedUser;
    }catch(error){
        console.log(error);
        throw error;
    }   
}

const deleteUserService = async (id: string) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        await user.deleteOne();
        return user;
    }catch(error){
        console.log(error);
        throw error;
    }
}

export {
    updateUserService,
    deleteUserService
}