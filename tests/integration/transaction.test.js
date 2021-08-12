import "../../src/setup.js";
import supertest from "supertest";
import app from "../../src/app.js";

import { clearDatabase, closeConnection } from "../utils/database.js";

import { createUser, createLogin } from "../factories/userFactory.js";
import { createTransaction } from "../factories/transactionFactory.js";

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeConnection();
});

const agent = supertest(app);
const tokenPattern = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}';

describe("POST /newincome", () => {
    it('returns status 201 for valid params', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const newIncome = createTransaction(exists.body.id, 'Entrada', 300, '01-01');

        const sendIncome = await agent.post("/newincome").send(newIncome).set("Authorization", `Bearer ${exists.body.token}`);

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(sendIncome.status).toEqual(201);
    });

    it('returns status 400 for empty description', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const newIncome = createTransaction(exists.body.id, '', 300, '01-01');

        const sendIncome = await agent.post("/newincome").send(newIncome).set("Authorization", `Bearer ${exists.body.token}`);

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(sendIncome.status).toEqual(400);
    });

    it('returns status 400 for negative value', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const newIncome = createTransaction(exists.body.id, 'Entrada', -300, '01-01');

        const sendIncome = await agent.post("/newincome").send(newIncome).set("Authorization", `Bearer ${exists.body.token}`);

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(sendIncome.status).toEqual(400);
    });

    it('returns status 400 if value is 0', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const newIncome = createTransaction(exists.body.id, 'Entrada', 0, '01-01');

        const sendIncome = await agent.post("/newincome").send(newIncome).set("Authorization", `Bearer ${exists.body.token}`);

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(sendIncome.status).toEqual(400);
    });

    it('returns status 400 for empty value', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const newIncome = createTransaction(exists.body.id, 'Entrada', '', '01-01');

        const sendIncome = await agent.post("/newincome").send(newIncome).set("Authorization", `Bearer ${exists.body.token}`);

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(sendIncome.status).toEqual(400);
    });

    it('returns status 401 for invalid token', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const newIncome = createTransaction(exists.body.id, 'Entrada', 300, '01-01');

        const sendIncome = await agent.post("/newincome").send(newIncome).set("Authorization", '');

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(sendIncome.status).toEqual(401);
    });
  
  });

  describe("POST /newoutgoing", () => {
    it('returns status 201 for valid params', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const newOutgoing = createTransaction(exists.body.id, 'Saida', 300, '01-01');

        const sendOutgoing = await agent.post("/newoutgoing").send(newOutgoing).set("Authorization", `Bearer ${exists.body.token}`);

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(sendOutgoing.status).toEqual(201);
    });

    it('returns status 400 for empty description', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const newOutgoing = createTransaction(exists.body.id, '', 300, '01-01');

        const sendOutgoing = await agent.post("/newoutgoing").send(newOutgoing).set("Authorization", `Bearer ${exists.body.token}`);

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(sendOutgoing.status).toEqual(400);
    });

    it('returns status 400 for negative value', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const newOutgoing = createTransaction(exists.body.id, 'Saida', -300, '01-01');

        const sendOutgoing = await agent.post("/newoutgoing").send(newOutgoing).set("Authorization", `Bearer ${exists.body.token}`);

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(sendOutgoing.status).toEqual(400);
    });

    it('returns status 400 if value is 0', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const newOutgoing = createTransaction(exists.body.id, 'Saida', 0, '01-01');

        const sendOutgoing = await agent.post("/newoutgoing").send(newOutgoing).set("Authorization", `Bearer ${exists.body.token}`);

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(sendOutgoing.status).toEqual(400);
    });

    it('returns status 400 for empty value', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const newOutgoing = createTransaction(exists.body.id, 'Saida', '', '01-01');

        const sendOutgoing = await agent.post("/newoutgoing").send(newOutgoing).set("Authorization", `Bearer ${exists.body.token}`);

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(sendOutgoing.status).toEqual(400);
    });

    it('returns status 401 for invalid token', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const newOutgoing = createTransaction(exists.body.id, 'Saida', 300, '01-01');

        const sendOutgoing = await agent.post("/newoutgoing").send(newOutgoing).set("Authorization", '');

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(sendOutgoing.status).toEqual(401);
    });
  
  });

  describe("GET /homepage", () => {
    it('returns status 200 for valid params and an empty array if there are no transactions', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const homepage = await agent.get("/homepage").set("Authorization", `Bearer ${exists.body.token}`);

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(homepage.status).toEqual(200);

        expect(homepage.body).toEqual([]);
    });

    it("returns status 201 for valid params, the balance and an array with the user's transactions", async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);
        
        const newIncome = createTransaction(exists.body.id, 'Entrada', 500, '01-01');

        const sendIncome = await agent.post("/newincome").send(newIncome).set("Authorization", `Bearer ${exists.body.token}`);

        const newOutgoing = createTransaction(exists.body.id, 'Saida', 250, '01-01');

        const sendOutgoing = await agent.post("/newoutgoing").send(newOutgoing).set("Authorization", `Bearer ${exists.body.token}`);

        const homepage = await agent.get("/homepage").set("Authorization", `Bearer ${exists.body.token}`);

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(sendIncome.status).toEqual(201);

        expect(sendOutgoing.status).toEqual(201);

        expect(homepage.status).toEqual(200);

        expect(homepage.body[0][0]).toEqual({
            id: expect.any(Number),
            idUser: exists.body.id,
            nomeTransacao: 'Entrada',
            entrada: 500,
            saida: 0,
            data: '01-01'
        });

        expect(homepage.body[0][1]).toEqual({
            id: expect.any(Number),
            idUser: exists.body.id,
            nomeTransacao: 'Saida',
            entrada: 0,
            saida: 250,
            data: '01-01'
        });

        expect(homepage.body[1]).toEqual(250);
    });

    it('returns status 401 if an invalid token is given', async () => {
        const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

        const request = await agent.post("/register").send(body);

        const login = createLogin('validmail@gmail.com', 'validpassword');

        const exists = await agent.post("/login").send(login);

        const homepage = await agent.get("/homepage").set("Authorization", '');

        expect(request.status).toEqual(201);

        expect(exists.status).toEqual(200);

        expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
        }));

        expect(homepage.status).toEqual(401);
    });

  });