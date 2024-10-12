import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path"; // Required to serve static files
import DBconnect from "./config/DBconnect.js";
import authRoute from "./routers/authRoute.js";
import postRoute from "./routers/postRoute.js";
import { app, server } from './socket/socket.js';
import commintRoute from "./routers/commintRoute.js";
import freindRouter from "./routers/freindRoute.js";
import messageRouter from "./routers/messageRoute.js";

dotenv.config({});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// API Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/commint', commintRoute);
app.use('/api/v1/friend', freindRouter);
app.use('/api/v1/message', messageRouter);

// Test route
app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "The app is working 😆",
  });
});


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred!",
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  DBconnect();
  console.log(`App is running on port ${PORT} 😁`);
});
