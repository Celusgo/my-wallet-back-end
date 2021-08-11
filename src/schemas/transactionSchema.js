import Joi from "joi";

const transactionSchema = Joi.object({
    description: Joi.string().pattern(/[a-zA-Z0-9]/).required(),
    value: Joi.number().min(1).required()
});

export {transactionSchema};