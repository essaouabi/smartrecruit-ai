// ===============================
// IMPORT SOCKET.IO CLIENT
// ===============================

import { io } from "socket.io-client";

// ===============================
// SOCKET INSTANCE
// ===============================

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: true,
});

// ===============================
// SOCKET EVENTS
// ===============================

socket.on("connect", () => {
  console.log("Socket.io connecté :", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket.io déconnecté");
});

// ===============================
// EXPORT
// ===============================

export default socket;