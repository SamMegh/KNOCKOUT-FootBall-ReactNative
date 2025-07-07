import cookie from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { connect } from './lib/connect.db.js';
import authRoutes from "./routes/auth.routes.js";

const app = express();

dotenv.config();
const Port= process.env.Port;
app.use(express.json());
app.use(cookie()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.originName,
  credentials: true
}));

app.use("/auth", authRoutes);

app.listen(Port, () => {
  console.log('Server is running on port port:'+Port);
  connect();
});