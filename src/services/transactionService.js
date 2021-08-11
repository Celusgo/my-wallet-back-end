import { checkSession } from "../repositories/userRepository.js";
import { newIncome, newOutgoing } from "../repositories/transactionRepository.js";

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

export{ completeIncome, completeOutgoing };

