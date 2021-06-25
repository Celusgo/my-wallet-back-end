import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';
import database from '../src/database.js';

beforeEach(async () => {
    await connection.query(`DELETE FROM clientes`);
  });

afterAll(() => {
    database.end();
});

describe("POST /register", () => {
         it("returns status 201 for valid params", async () => {
            const body = {
                "name": "Marcelo",
                "email": "marcelo@gmail.com",
                "password": "senhateste" 
            }
            const test = await supertest(app).post("/register").send(body);
            expect(test.status).toEqual(201);
        });

        it("returns status 400 for empty name", async () => {
            const body = {
                "name": "",
                "email": "marcelo@gmail.com",
                "password": "senhateste" 
            }
            const test = await supertest(app).post("/register").send(body);
            expect(test.status).toEqual(400);
        });

        it("returns status 400 for invalid format or empty email", async () => {
            const body = {
                "name": "Marcelo",
                "email": "invalidmail",
                "password": "senhateste" 
            }
            const test = await supertest(app).post("/register").send(body);
            expect(test.status).toEqual(400);
        });

        it("returns status 400 for password with less than 4 characters", async () => {
            const body = {
                "name": "Marcelo",
                "email": "marcelo@gmail.com",
                "password": "123" 
            }
            const test = await supertest(app).post("/register").send(body);
            expect(test.status).toEqual(400);
        });

        it("returns status 409 for password already registered", async () => {
            const body = {
                "name": "Marcelo",
                "email": "marcelo@gmail.com",
                "password": "senhateste" 
            }
            const test = await supertest(app).post("/register").send(body);
            expect(test.status).toEqual(201);
            const exist = await supertest(app).post("/register").send(body);
            expect(exist.status).toEqual(409);
        });
     
 });

 describe("POST /login", () => {
    it("returns status 201 for valid params", async () => {
        const body = {
            "name": "Marcelo",
            "email": "marcelo@gmail.com",
            "password": "senhateste" 
        }
        const login ={
            "email": "marcelo@gmail.com",
            "password": "senhateste" 
        }
        const test = await supertest(app).post("/register").send(body);
        expect(test.status).toEqual(201);
        const exist = await supertest(app).post("/login").send(login);
        expect(exist.status).toEqual(200);
    });

    it("returns status 400 for invalid params", async () => {
        const body = {
            "name": "Marcelo",
            "email": "marcelo@gmail.com",
            "password": "senhateste" 
        }
        const login ={
            "email": "invalidmail",
            "password": "senhateste" 
        }
        const test = await supertest(app).post("/register").send(body);
        expect(test.status).toEqual(201);
        const exist = await supertest(app).post("/login").send(login);
        expect(exist.status).toEqual(400);
    });

    it("returns status 401 for invalid user", async () => {
        const body = {
            "name": "Marcelo",
            "email": "marcelo@gmail.com",
            "password": "senhateste" 
        }
        const login ={
            "email": "marcelo2@gmail.com",
            "password": "senhateste" 
        }
        const test = await supertest(app).post("/register").send(body);
        expect(test.status).toEqual(201);
        const exist = await supertest(app).post("/login").send(login);
        expect(exist.status).toEqual(401);
    });

    it("returns status 401 for invalid password", async () => {
        const body = {
            "name": "Marcelo",
            "email": "marcelo@gmail.com",
            "password": "senhateste" 
        }
        const login ={
            "email": "marcelo@gmail.com",
            "password": "senhateste2" 
        }
        const test = await supertest(app).post("/register").send(body);
        expect(test.status).toEqual(201);
        const exist = await supertest(app).post("/login").send(login);
        expect(exist.status).toEqual(401);
    });

});
 