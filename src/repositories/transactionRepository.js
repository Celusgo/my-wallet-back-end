import connection from '../database.js';

async function newIncome(idUser, description, value, data){
    await connection.query(
        'INSERT INTO transacoes ("idUser", "nomeTransacao", entrada, saida, data) VALUES ($1, $2, $3, $4, $5)',
        [idUser, description, value, 0, data]);
};

async function newOutgoing(idUser, description, value, data){
    await connection.query(
        'INSERT INTO transacoes ("idUser", "nomeTransacao", entrada, saida, data) VALUES ($1, $2, $3, $4, $5)',
        [idUser, description, 0, value, data]);
};

export { newIncome, newOutgoing };