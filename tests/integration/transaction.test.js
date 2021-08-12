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