import connection from "../../src/database.js";

export async function clearDatabase () {
  await connection.query(`TRUNCATE "transacoes" RESTART IDENTITY`);
  await connection.query(`DELETE FROM "clientes"`);
};

export async function closeConnection () {
  await connection.end();
};