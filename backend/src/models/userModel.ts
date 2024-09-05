// backend/src/models/userModel.ts

import Joi from "joi";
import { ValidationError } from "./exceptions";

interface UserInterface {
    id?: number;
    firstName: string;
    lastName: string;
    password?: string;
    email: string;
    role: string;
    isAdmin: boolean;
    token: string;
}

export default class UserModel {
    id?: number;
    firstName: string;
    lastName: string;
    password?: string;
    email: string;
    role: string;
    isAdmin: boolean;
    token: string;

    constructor(user: UserInterface ){
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.password = user.password;
        this.email = user.email;
        this.role = user.role;
        this.isAdmin = user.isAdmin;
        this.token = user.token;
    }

    private static validateSchema = Joi.object({
      id: Joi.number().optional().positive(),
      firstName: Joi.string().required().min(2).max(50),
      lastName: Joi.string().required().min(2).max(50),
      password: Joi.string().required().min(4).max(15),
      email: Joi.string().required().email(),
      role: Joi.string().required(),
      isAdmin: Joi.boolean().optional(),
      token: Joi.string().optional(),
    })

    validate(): void{
        const res = UserModel.validateSchema.validate(this)
        if (res.error){                                                
            throw new ValidationError(res.error.details[0].message)            
        }
    }
}