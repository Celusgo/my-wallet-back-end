import express from 'express';
import cors from 'cors';
import connection from './database.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { signIn, signUp } from "./controllers/userController.js";
import { newIncome, newOutgoing } from "./controllers/transactionController.js";

const app = express();
app.use(cors());
app.use(express.json());



app.post("/register", signUp);

app.post("/login", signIn);

app.post("/newincome", newIncome);

app.post("/newoutgoing", newOutgoing);

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