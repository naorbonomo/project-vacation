import Joi from "joi";
import { ValidationError } from "./exceptions";

class OrderProduct {
    id?: number;
    productId: number;
    orderId: number;
    // order ? : OrderModel
    quantity: number;

    constructor(op: Partial<OrderProduct>) {
        this.id = op.id;
        this.productId = op.productId;
        this.orderId = op.orderId;
        this.quantity = op.quantity;
    }

    private static validateSchema = Joi.object({
        id: Joi.number().optional().positive(),
        productId: Joi.number().positive().required(),
        orderId: Joi.number().positive().optional(),  // optional for when order not created yet
        quantity: Joi.number().positive().required()
    })

    validate(): void {
        const res = OrderProduct.validateSchema.validate(this)
        if (res.error) {
            throw new ValidationError(res.error.details[0].message)
        }
    }
}

export default OrderProduct;