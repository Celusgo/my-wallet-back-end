import express from 'express';
import cors from 'cors';

import { signIn, signUp, signOut } from "./controllers/userController.js";
import { newIncome, newOutgoing, allTransactions } from "./controllers/transactionController.js";

const app = express();
app.use(cors());
app.use(express.json());


app.post("/register", signUp);

app.post("/login", signIn);

app.post("/newincome", newIncome);

app.post("/newoutgoing", newOutgoing);

app.get("/homepage", allTransactions);

app.post("/logout", signOut);

export default app;