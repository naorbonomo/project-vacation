// backend/src/models/userModel.ts

import Joi from "joi";
import { ValidationError } from "./exceptions";

interface UserInterface {
    id?: number;
    first_name: string;
    last_name: string;
    password?: string;
    email: string;
    role: string;
    isAdmin: boolean;
    token: string;
}

export default class UserModel {
    id?: number;
    first_name: string;
    last_name: string;
    password?: string;
    email: string;
    role: string;
    isAdmin: boolean;
    token: string;

    constructor(user: UserInterface ){
        this.id = user.id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.password = user.password;
        this.email = user.email;
        this.role = user.role;
        this.isAdmin = user.isAdmin;
        this.token = user.token;
    }

    private static validateSchema = Joi.object({
      id: Joi.number().optional().positive(),
      first_name: Joi.string().required().min(2).max(50),
      last_name: Joi.string().required().min(2).max(50),
      password: Joi.string().required().min(4).max(15),
      email: Joi.string().required().email(),
      role: Joi.string().optional(),
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