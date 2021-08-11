
import { findExistingMail, newUser, newSession } from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

async function completeRegistry(name, email, password){
    const checkExistingEmail = await findExistingMail(email);

    if (checkExistingEmail) return null;

    const hashedPassword = bcrypt.hashSync(password, 12);

    await newUser(name, email, hashedPassword);
}

async function authenticateSignIn(email, password){
    const registeredUser = await findExistingMail(email);

    if(!registeredUser || !bcrypt.compareSync(password, registeredUser.senha)) return null;

    const token = uuid();

    await newSession(registeredUser.id, token);

    return token;
}

export {completeRegistry, authenticateSignIn};