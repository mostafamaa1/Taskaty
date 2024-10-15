// server.js
const express = require("express");
const { Server } = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

let io; // Declare io outside to maintain a single instance

app.prepare().then(() => {
  const server = express();

  // Create HTTP server with Express
  const httpServer = require("http").createServer(server);

  // Create Socket.IO server only once
  if (!io) {
    io = new Server(httpServer, {
      cors: {
        origin: "*", // Adjust this for your security needs
      },
    });

    // Handle socket connections
    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Broadcast when a user logs in
      socket.on("user:login", (user) => {
        console.log(`${user.name} has logged in.`);
        socket.broadcast.emit("user:login", `${user.name} has logged in.`);
      });

      // Broadcast when a task is added
      socket.on("task:add", (task) => {
        console.log(`Task added by ${task.user}: ${task.title}`);
        socket.broadcast.emit("task:add", task);
      });

      // Broadcast when a task is updated
      socket.on("task:update", (task) => {
        console.log(`Task updated by ${task.user}: ${task.title}`);
        socket.broadcast.emit("task:update", task);
      });

      // Broadcast when a task is deleted
      socket.on("task:delete", (user) => {
        console.log(`Task deleted by ${user.name}`);
        socket.broadcast.emit("task:delete", user);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  // Handle all Next.js pages
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // Start the HTTP server
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
