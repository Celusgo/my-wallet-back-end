import { completeIncome, completeOutgoing } from "../services/transactionService.js";
import { transactionSchema } from "../schemas/transactionSchema.js";

async function newIncome(req, res){
    const authorization = req.headers.authorization;
    
    const token = authorization?.replace('Bearer ', "");

    const { idUser, description, value, data } = req.body;

    const validate = transactionSchema.validate({
        description,
        value
    });

    if (validate.error) return res.status(400).send("Os dados foram inseridos de forma inválida.");

    try{
        const tryIncome = await completeIncome(idUser, description, value, data, token);

        if (tryIncome === null) return res.status(401).send("Você não tem permissão para realizar esta ação!");

        res.sendStatus(201);

    } catch{
        console.error(err);

        res.sendStatus(500);
    }
};

async function newOutgoing(req, res){
    const authorization = req.headers.authorization;
    
    const token = authorization?.replace('Bearer ', "");

    const { idUser, description, value, data } = req.body;

    const validate = transactionSchema.validate({
        description,
        value
    });

    if (validate.error) return res.status(400).send("Os dados foram inseridos de forma inválida.");

    try{
        const tryIncome = await completeOutgoing(idUser, description, value, data, token);

        if (tryIncome === null) return res.status(401).send("Você não tem permissão para realizar esta ação!");

        res.sendStatus(201);

    } catch{
        console.error(err);

        res.sendStatus(500);
    }
};

export { newIncome, newOutgoing };