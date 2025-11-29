const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");

let onlineUsers = new Map();

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      // Store user online
      onlineUsers.set(userId, socket.id);

      // Notify frontend
      io.emit("userOnline", userId);

      socket.join(roomId);
      console.log("Joined room:", roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          // FRIEND CHECK (CORRECT)
          const existingConnectionRequest =
            await ConnectionRequestModel.findOne({
              status: "accepted",
              $or: [
                { fromUserId: userId, toUserId: targetUserId },
                { fromUserId: targetUserId, toUserId: userId },
              ],
            });

          if (!existingConnectionRequest) {
            return;
          }

          const roomId = getSecretRoomId(userId, targetUserId);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(roomId).emit("messageReceived", {
            userId,
            firstName,
            lastName,
            text,
            createdAt: new Date().toISOString(),
          });
        } catch (err) {
          console.log("ERROR", err);
        }
      }
    );

    socket.on("disconnect", () => {
      for (const [uid, sid] of onlineUsers.entries()) {
        if (sid === socket.id) {
          onlineUsers.delete(uid);
          io.emit("userOffline", {
            userId: uid,
            lastSeen: new Date(),
          });
        }
      }
    });
  });
};

module.exports = initializeSocket;
