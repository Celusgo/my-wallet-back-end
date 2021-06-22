import express from 'express';
import cors from 'cors';
import pg from 'pg';
import joi from 'joi';

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;
const user = 'bootcamp_role';
const password = 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp';
const host = 'localhost';
const port = 5432;
const database = 'boardcamp';

const connection = new Pool({
    user,
    password,
    host,
    port,
    database
});





app.listen(4000, () => {
    console.log("Rodando na porta 4000!");
});