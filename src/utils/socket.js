const socket = require("socket.io");
const crypto = require("crypto");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // handle events

    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log("joining Room :" + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      ({ firstName, lastName, userId, targetUserId, text }) => {
        const roomId = getSecretRoomId(userId, targetUserId);

        console.log(firstName + lastName + " " + text);
        io.to(roomId).emit("messageReceived", {
          userId,
          targetUserId,
          firstName,
          lastName,
          text,
        });
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
