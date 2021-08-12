import { completeRegistry, authenticateSignIn, completeSignOut } from "../services/userService.js";
import { userSchema, loginSchema } from "../schemas/userSchema.js";

async function signUp(req, res) {
    const { name, email, password } = req.body;

    const validate = userSchema.validate(req.body);

    if (validate.error) return res.status(400).send("Os dados foram inseridos de forma inválida.");

    try {
        const createUser = await completeRegistry(name, email, password);
        
        if (createUser === null) return res.sendStatus(409);

        res.sendStatus(201);

    } catch (err) {
        console.error(err);

        res.sendStatus(500);
    }
};

async function signIn(req, res) {
    const { email, password } = req.body;

    const validate = loginSchema.validate(req.body);

    if (validate.error) return res.status(400).send("Os dados foram inseridos de forma inválida.");

    try {

        const token = await authenticateSignIn(email, password);

        if (token === null) return res.status(401).send("Email e/ou senha inválidos.");

        res.status(200).send(token);

    } catch (err) {
        console.error(err);

        res.sendStatus(500);
    }
};

async function signOut(req, res) {
    const authorization = req.headers.authorization;
    
    const token = authorization?.replace('Bearer ', "");

    if (!token) return res.sendStatus(401);

    try{
        await completeSignOut(token);

        return res.sendStatus(200);

    } catch(err){
        console.error(err);

        res.sendStatus(500);
    }

};

export { signUp, signIn, signOut };
