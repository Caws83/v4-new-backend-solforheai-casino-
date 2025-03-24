const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("🎰 SolForgeAI Backend is Live!");
});

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("join-table", (player) => {
    socket.broadcast.emit("update-players", [player]);
  });

  socket.on("chat-message", (msg) => {
    io.emit("chat-message", msg);
  });

  socket.on("start-game", () => {
    console.log("Game started");
    io.emit("deal-cards", { cards: ["🂡", "🂱"] });
    io.emit("community-cards", ["🂢", "🂲", "🂳"]);
  });

  socket.on("player-action", ({ id, action }) => {
    console.log(`Player ${id} chose to ${action}`);
    io.emit("turn-update", id);
    io.emit("pot-update", Math.floor(Math.random() * 1000));
    io.emit("round-result", { winner: id });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Backend listening on port ${PORT}`);
});
