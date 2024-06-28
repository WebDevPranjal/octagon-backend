export type UserType = {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isPaid: boolean;
    paidCategory?: string;
}


