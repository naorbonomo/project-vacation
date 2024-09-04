import Joi from "joi";
import { ValidationError } from "./exceptions";

interface UserInterface {
    id?: number;
    username: string;
    password?: string;
    email: string;
    isAdmin: boolean;
    token: string;
}

export default class UserModel {
    id?: number;
    username: string;
    password?: string;
    email: string;
    isAdmin: boolean;
    token: string;

    constructor(user: UserInterface ){
        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.isAdmin = user.isAdmin;
        this.token = user.token;
    }

    private static validateSchema = Joi.object({
      id: Joi.number().optional().positive(),
      username: Joi.string().required().min(2).max(50),
      password: Joi.string().required().min(4).max(15),
      email: Joi.string().required().email(),
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