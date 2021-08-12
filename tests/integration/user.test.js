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
const tokenPattern = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}';

describe("POST /register", () => {

  it("returns status 201 for valid params", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const request = await agent.post("/register").send(body);

    expect(request.status).toEqual(201);
  });

  it("returns status 400 for empty name", async () => {
    const body = createUser('', 'validmail@gmail.com', 'validpassword');

    const request = await agent.post("/register").send(body);

    expect(request.status).toEqual(400);
  });

  it("returns status 400 for invalid format email", async () => {
    const body = createUser('validname', 'invalidmailformat', 'validpassword');

    const request = await agent.post("/register").send(body);

    expect(request.status).toEqual(400);
  });

  it("returns status 400 for empty email", async () => {
    const body = createUser('validname', '', 'validpassword');

    const request = await agent.post("/register").send(body);

    expect(request.status).toEqual(400);
  });

  it("returns status 400 for password with less than 4 characters", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'abc');

    const request = await agent.post("/register").send(body);
    
    expect(request.status).toEqual(400);
  });

  it("returns status 409 for email already registered", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const request = await agent.post("/register").send(body);

    expect(request.status).toEqual(201);

    const exists = await agent.post("/register").send(body);
    
    expect(exists.status).toEqual(409);
  });

});

describe("POST /login", () => {

  it("returns status 200 for valid params and a valid object with a token", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const request = await agent.post("/register").send(body);

    const login = createLogin('validmail@gmail.com', 'validpassword');

    const exists = await agent.post("/login").send(login);

    expect(request.status).toEqual(201);

    expect(exists.status).toEqual(200);

    expect(exists.body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      nome: body.name,
      email: body.email,
      token: expect.stringMatching(tokenPattern),
    }));
  });

  it("returns status 400 for invalid email format", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const request = await agent.post("/register").send(body);

    const login = createLogin('invalidmailformat', 'validpassword');

    const exists = await agent.post("/login").send(login);

    expect(request.status).toEqual(201);
    
    expect(exists.status).toEqual(400);
  });

  it("returns status 400 for password with less than 4 characters", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const request = await agent.post("/register").send(body);

    const login = createLogin('invalidmailformat', 'abc');

    const exists = await agent.post("/login").send(login);

    expect(request.status).toEqual(201);
    
    expect(exists.status).toEqual(400);
  });

  it("returns status 401 for unregistered email", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const request = await agent.post("/register").send(body);

    const login = createLogin('validmail2@gmail.com', 'validpassword');

    const exists = await agent.post("/login").send(login);

    expect(request.status).toEqual(201);
    
    expect(exists.status).toEqual(401);
  });

  it("returns status 401 for unregistered password", async () => {
    const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

    const request = await agent.post("/register").send(body);

    const login = createLogin('validmail@gmail.com', 'validpassword2');

    const exists = await agent.post("/login").send(login);

    expect(request.status).toEqual(201);
    
    expect(exists.status).toEqual(401);
  });

});

describe("POST /logout", () => {

    it("returns status 200 if the user is logged in and tries to logout passing a valid token", async () => {
      const body = createUser('validname', 'validmail@gmail.com', 'validpassword');

      const request = await agent.post("/register").send(body);

      const login = createLogin('validmail@gmail.com', 'validpassword');

      const exists = await agent.post("/login").send(login);

      const logout = await agent.post("/logout").set("Authorization", `Bearer ${exists.body.token}`);

      expect(request.status).toEqual(201);

      expect(exists.status).toEqual(200);

      expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
      }));

      expect(logout.status).toEqual(200);
    });

    it("returns status 401 if no token is passed", async () => {
      const body = createUser('validname', 'validmail@gmail.com', 'validpassword');
      
      const request = await agent.post("/register").send(body);

      const login = createLogin('validmail@gmail.com', 'validpassword');

      const exists = await agent.post("/login").send(login);

      const logout = await agent.post("/logout").set("Authorization", '');

      expect(request.status).toEqual(201);

      expect(exists.status).toEqual(200);

      expect(exists.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        nome: body.name,
        email: body.email,
        token: expect.stringMatching(tokenPattern),
      }));

      expect(logout.status).toEqual(401);
    });

});
