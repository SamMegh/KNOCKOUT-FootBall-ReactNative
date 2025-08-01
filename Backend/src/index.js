import cookie from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { app, server } from "./lib/socket.config.js";

import { connect } from './lib/connect.db.js';
import authRoutes from "./routes/auth.routes.js";
import matchRoutes from "./routes/data.route.js";
import playRoutes from "./routes/play.routes.js";

dotenv.config();
const Port= process.env.Port;
app.use(express.json());
app.use(cookie()); 
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: (origin, callback) => {
    if (process.env.originName.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use("/auth", authRoutes);
app.use("/play", playRoutes);
app.use("/data", matchRoutes);

server.listen(Port, () => {
  console.log('Server is running on port port:'+Port);
  connect();
});


