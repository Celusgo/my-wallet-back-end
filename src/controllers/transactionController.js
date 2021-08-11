import { completeIncome, completeOutgoing, getAllTransactions } from "../services/transactionService.js";
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

    } catch (err){
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
        const tryOutgoing = await completeOutgoing(idUser, description, value, data, token);

        if (tryOutgoing === null) return res.status(401).send("Você não tem permissão para realizar esta ação!");

        res.sendStatus(201);

    } catch (err){
        console.error(err);

        res.sendStatus(500);
    }
};

async function allTransactions(req, res){
    const authorization = req.headers.authorization;
    
    const token = authorization?.replace('Bearer ', "");

    try{
        const getUserTransactions = await getAllTransactions(token);

        if (getUserTransactions === null) return res.status(401).send("Você não tem permissão para realizar esta ação!");

        if (getUserTransactions.length === 0) return res.status(200).send([]);

        const balance = getUserTransactions.reduce((acc, item) => acc + (item.entrada - item.saida), 0);

        res.status(200).send([getUserTransactions, balance]);

    } catch (err){
        console.error(err);

        res.sendStatus(500);
    }
};

export { newIncome, newOutgoing, allTransactions };