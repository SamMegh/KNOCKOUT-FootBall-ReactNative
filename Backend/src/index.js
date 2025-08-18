import cookie from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { app, server } from "./lib/socket.config.js";

import { connect } from './lib/connect.db.js';
import authRoutes from "./routes/auth.routes.js";
import matchRoutes from "./routes/data.route.js";
import payRoutes from "./routes/payment.route.js";
import playRoutes from "./routes/play.routes.js";

dotenv.config();
const Port= process.env.Port;
// ✅ Skip JSON parsing for Stripe webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/payment/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});


app.use(cookie()); 
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use("/auth", authRoutes);
app.use("/play", playRoutes);
app.use("/data", matchRoutes);
app.use("/payment", payRoutes);

server.listen(Port, () => {
  console.log('Server is running on port port:'+Port);
  connect();
});


