import express from "express";
import http from "http";
import { Server } from "socket.io";


export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST"],
  },
});

let userSocketMap = {};

export const getSocketId = (id) => {
  return userSocketMap[id];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }  

  io.emit("getOnlineUsers",Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }
     io.emit("getOnlineUsers",Object.keys(userSocketMap))
  });
});
