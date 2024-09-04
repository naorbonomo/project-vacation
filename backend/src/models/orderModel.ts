import Joi from "joi";
import { ValidationError } from "./exceptions";
import OrderProduct from "./orderProduct";

class OrderModel {
    id?: number;
    userId: number;
    created: Date;
    comments?: string;
    products? : OrderProduct []    

    constructor(userId: number, created: Date, comments?: string, id?: number, products?:OrderProduct[]) {
        this.id = id;
        this.userId = userId;
        this.created = created;
        this.comments = comments;
        this.products = products;
    }

    private static schema = Joi.object({
        id: Joi.number().optional().positive(),
        userId: Joi.number().optional().positive(),
        created: Joi.date().required(),
        comments: Joi.string().optional().allow(""),
        products: Joi.optional()
    })

    validate(): void {
        const res = OrderModel.schema.validate(this);
        if (res.error) {
            throw new ValidationError(res.error.details[0].message);
        }
    }
}

export default OrderModel;