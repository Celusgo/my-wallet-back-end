import Joi from "joi";

const transactionSchema = Joi.object({
    description: Joi.string().pattern(/[a-zA-Z0-9]/).required(),
    value: Joi.number().positive().min(1).required()
});

export {transactionSchema};