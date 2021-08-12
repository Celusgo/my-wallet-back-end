import "../../src/setup.js";
import supertest from "supertest";
import app from "../../src/app.js";

import { clearDatabase, closeConnection } from "../utils/database.js";

import { createUser, createLogin } from "../factories/userFactory.js";

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeConnection();
});

const agent = supertest(app);

describe("POST /register", () => {
  it("returns status 201 for valid params", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const test = await agent.post("/register").send(body);

    expect(test.status).toEqual(201);
  });

  it("returns status 400 for empty name", async () => {
    const body = createUser('', 'validmail@gmail.com', 'validpassword');

    const test = await agent.post("/register").send(body);

    expect(test.status).toEqual(400);
  });

  it("returns status 400 for invalid format email", async () => {
    const body = createUser('validname', 'invalidmailformat', 'validpassword');

    const test = await agent.post("/register").send(body);

    expect(test.status).toEqual(400);
  });

  it("returns status 400 for empty email", async () => {
    const body = createUser('validname', '', 'validpassword');

    const test = await agent.post("/register").send(body);

    expect(test.status).toEqual(400);
  });

  it("returns status 400 for password with less than 4 characters", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'abc');

    const test = await agent.post("/register").send(body);
    
    expect(test.status).toEqual(400);
  });

  it("returns status 409 for email already registered", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const test = await agent.post("/register").send(body);

    expect(test.status).toEqual(201);

    const exist = await agent.post("/register").send(body);
    
    expect(exist.status).toEqual(409);
  });
});

describe("POST /login", () => {
  it("returns status 200 for valid params", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const test = await agent.post("/register").send(body);

    const login = createLogin('validmail@gmail.com', 'validpassword');

    const exist = await agent.post("/login").send(login);

    expect(test.status).toEqual(201);

    expect(exist.status).toEqual(200);
  });

  it("returns status 400 for invalid email format", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const test = await agent.post("/register").send(body);

    const login = createLogin('invalidmailformat', 'validpassword');

    const exist = await agent.post("/login").send(login);

    expect(test.status).toEqual(201);
    
    expect(exist.status).toEqual(400);
  });

  it("returns status 400 for password with less than 4 characters", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const test = await agent.post("/register").send(body);

    const login = createLogin('invalidmailformat', 'abc');

    const exist = await agent.post("/login").send(login);

    expect(test.status).toEqual(201);
    
    expect(exist.status).toEqual(400);
  });

  it("returns status 401 for unregistered email", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const test = await agent.post("/register").send(body);

    const login = createLogin('validmail2@gmail.com', 'validpassword');

    const exist = await agent.post("/login").send(login);

    expect(test.status).toEqual(201);
    
    expect(exist.status).toEqual(401);
  });

  it("returns status 401 for unregistered password", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const test = await agent.post("/register").send(body);

    const login = createLogin('validmail@gmail.com', 'validpassword2');

    const exist = await agent.post("/login").send(login);

    expect(test.status).toEqual(201);
    
    expect(exist.status).toEqual(401);
  });
});
