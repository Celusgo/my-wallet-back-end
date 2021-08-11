import express from 'express';
import cors from 'cors';
import connection from './database.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { signIn, signUp } from "./controllers/userController.js";

const app = express();
app.use(cors());
app.use(express.json());



app.post("/register", signUp);

app.post("/login", signIn);

app.post("/newincome", async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', "");
    const { idUser, description, value, data } = req.body;

    if (!token) {
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
        await connection.query('INSERT INTO transacoes ("idUser", "nomeTransacao", entrada, saida, data) VALUES ($1, $2, $3, $4, $5)', [idUser, description, value, 0, data]);
        res.status(201).send("Sucesso!");

    } catch (err) {
        console.log(err);
        res.status(500).send("Ocorreu um erro. Por favor, tente novamente!");
    };
});

app.post("/newoutgoing", async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', "");
    const { idUser, description, value, data } = req.body;

    if (!token) {
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
        await connection.query('INSERT INTO transacoes ("idUser", "nomeTransacao", entrada, saida, data) VALUES ($1, $2, $3, $4, $5)', [idUser, description, 0, value, data]);
        res.status(201).send("Sucesso!");

    } catch (err) {
        console.log(err);
        res.status(500).send("Ocorreu um erro. Por favor, tente novamente!");
    };
});

app.get("/homepage", async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', "");


    if (!token) {
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
        if (thisUserTransactions.rows.length === 0) {
            res.status(200).send([]);
            return;
        }
        const balance = thisUserTransactions.rows.reduce((acc, item) => acc + (item.entrada - item.saida), 0);
        res.status(200).send([thisUserTransactions.rows, balance]);

    } catch (err) {
        console.log(err);
        res.status(500).send("Ocorreu um erro. Por favor, tente novamente!");
    };
});

app.post("/logout", async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', "");

    if (!token) {
        res.status(401).send("Você não tem permissão para realizar esta ação!");
        return;
    }
    try {
        await connection.query(`DELETE FROM sessoes WHERE token = $1`, [token]);
        res.sendStatus(200);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Ocorreu um erro. Por favor, tente novamente!");
    }
});

export default app;