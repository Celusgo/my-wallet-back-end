import express from 'express';
import cors from 'cors';
import pg from 'pg';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

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
        password: password,
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


app.listen(4000, () => {
    console.log("Rodando na porta 4000!");
});