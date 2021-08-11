
import connection from '../database.js';

async function findExistingMail(email){
    const request = await connection.query(
        `SELECT * FROM "clientes" WHERE "email" = $1`,
        [email]
    );

    return request.rows[0];
};

async function newUser(name, email, password){
    await connection.query(
        `INSERT INTO "clientes" ("nome", "email", "senha") VALUES ($1, $2, $3)`,
        [name, email, password]
    );   
}

async function newSession(userId, token){
    await connection.query(
        `INSERT INTO sessoes ("idUser", token) VALUES ($1, $2)`,
        [userId, token]);
}

export {findExistingMail, newUser, newSession};
