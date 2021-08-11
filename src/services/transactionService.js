import { checkSession, checkUserId } from "../repositories/userRepository.js";
import { newIncome, newOutgoing, allTransactions } from "../repositories/transactionRepository.js";

async function completeIncome(userId, description, value, data, token){
    const existingSession = await checkSession(userId, token);

    if (!existingSession) return null;

    await newIncome(userId, description, value, data);

};

async function completeOutgoing(userId, description, value, data, token){
    const existingSession = await checkSession(userId, token);

    if (!existingSession) return null;

    await newOutgoing(userId, description, value, data);

};

async function getAllTransactions(token){
    const existingSession = await checkUserId(token);

    if (!existingSession) return null;

    const thisUserTransactions = await allTransactions(existingSession);

    return thisUserTransactions;

};

export{ completeIncome, completeOutgoing, getAllTransactions };

