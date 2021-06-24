import express from 'express';
import cors from 'cors';
import pg from 'pg';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

const connection = new Pool({
    user: 'postgres',
    password: '1',
    host: 'localhost',
    port: 5432,
    database: 'mywallet'
});


app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const userSchema = Joi.object({
        name: Joi.string().min(1).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().alphanum().pattern(/[a-zA-Z0-9]/).min(4).required()
    })

    const { error } = userSchema.validate({
        name: name,
        email: email,
        password: password
    })

    if (error) {
        res.sendStatus(400);
        return;
    }

    try {
        const checkEmail = await connection.query(`SELECT * FROM clientes WHERE email = $1`, [email]);

        if (checkEmail.rows.length !== 0) {
            res.status(400).send("Este email já está cadastrado.");
            return;
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        await connection.query(`INSERT INTO clientes (nome, email, senha) VALUES ($1, $2, $3)`, [name, email, hashedPassword])

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const loginSchema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().alphanum().pattern(/[a-zA-Z0-9]/).min(4).required()
    })

    const { error } = loginSchema.validate({
        email: email,
        password: password
    })

    if (error) {
        res.status(400).send("Os dados foram inseridos de forma inválida.");
        return;
    };

    try {
        const checkUser = await connection.query(`
        SELECT * FROM clientes WHERE email = $1 `, [email]);
        if (checkUser.rows.length !== 0 && bcrypt.compareSync(password, checkUser.rows[0].senha)) {
            const token = uuid();
            await connection.query(`INSERT INTO sessoes ("idUser", token) VALUES ($1, $2)`, [checkUser.rows[0].id, token]);
            delete checkUser.rows[0].senha;
            res.send([{ ...checkUser.rows[0], token: token }][0]);
        } else {
            res.status(401).send("Usuário e/ou senha incorreto(s).");
        }
    } catch (err) {
        console.log(err);
        res.status(400).send("Ocorreu um erro. Por favor, tente novamente!");
    };
});

app.post("/newincome", async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', "");
    const {idUser, description, value, data} = req.body;

    if(!token){
        res.status(401).send("Você não tem permissão para realizar esta ação!");
        return;
    }
    
    const incomeSchema = Joi.object({
        description: Joi.string().pattern(/[a-zA-Z0-9]/).required(),
        value: Joi.number().min(1).required()
    })

    const { error } = incomeSchema.validate({
        description: description,
        value: value
    })

    if (error) {
        res.status(400).send("Os dados foram inseridos de forma inválida.");
        return;
    };

    try {
        const checkToken = await connection.query(`SELECT * FROM sessoes WHERE token = $1 AND "idUser" = $2`, [token, idUser]);
        if (checkToken.rows.length === 0) {
            res.status(401).send("Você não tem permissão para realizar esta ação!");
            return;
        }
        await connection.query('INSERT INTO transacoes ("idUser", "nomeTransacao", entrada, data) VALUES ($1, $2, $3, $4)', [idUser, description, value, data]);
        res.status(201).send("Sucesso!");

    } catch (err) {
        console.log(err);
        res.status(400).send("Ocorreu um erro. Por favor, tente novamente!");
    };
});

app.post("/newoutgoing", async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', "");
    const {idUser, description, value, data} = req.body;

    if(!token){
        res.status(401).send("Você não tem permissão para realizar esta ação!");
        return;
    }
    
    const incomeSchema = Joi.object({
        description: Joi.string().pattern(/[a-zA-Z0-9]/).required(),
        value: Joi.number().min(1).required()
    })

    const { error } = incomeSchema.validate({
        description: description,
        value: value
    })

    if (error) {
        res.status(400).send("Os dados foram inseridos de forma inválida.");
        return;
    };

    try {
        const checkToken = await connection.query(`SELECT * FROM sessoes WHERE token = $1 AND "idUser" = $2`, [token, idUser]);
        if (checkToken.rows.length === 0) {
            res.status(401).send("Você não tem permissão para realizar esta ação!");
            return;
        }
        await connection.query('INSERT INTO transacoes ("idUser", "nomeTransacao", saida, data) VALUES ($1, $2, $3, $4)', [idUser, description, value, data]);
        res.status(201).send("Sucesso!");

    } catch (err) {
        console.log(err);
        res.status(400).send("Ocorreu um erro. Por favor, tente novamente!");
    };
});

app.get("/homepage", async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', "");
    

    if(!token){
        res.status(401).send("Você não tem permissão para realizar esta ação!");
        return;
    }

    try {
        const checkToken = await connection.query(`SELECT * FROM sessoes WHERE token = $1`, [token]);
        if (checkToken.rows.length === 0) {
            res.status(401).send("Você não tem permissão para realizar esta ação!");
            return;
        }
        const thisUserTransactions = await connection.query('SELECT * FROM transacoes WHERE "idUser" = $1', [checkToken.rows[0].idUser]);
        if(thisUserTransactions.rows.length === 0){
            res.send([]);
        }
        res.send(thisUserTransactions.rows);

    } catch (err) {
        console.log(err);
        res.status(400).send("Ocorreu um erro. Por favor, tente novamente!");
    };
});

app.listen(4000, () => {
    console.log("Rodando na porta 4000!");
});