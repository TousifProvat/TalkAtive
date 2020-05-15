const http = require("http");
const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const ejs = require("ejs");

//utils
const { addUser, getUser, userLeave, getRoomUsers } = require("./utils/users");
const messageFormat = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//static file
app.use(express.static(path.join(__dirname, "../public")));

//routes setup
const chatAppRoute = require("./routes/chatapp");
app.use(chatAppRoute);

//run when connect
io.on("connect", (socket) => {
  socket.on("joinRoom", ({ username, room }, callback) => {
    const user = addUser(socket.id, username, room);
    const { error } = user;
    if (error) {
      return callback(error);
      
    }

    socket.join(user.room);
    //welcome user
    socket.emit("sysMessage", "Welcome to chat App");
    //when joins
    socket.broadcast
      .to(user.room)
      .emit("sysMessage", `${user.username} has joined`);

    //send users and rooom info

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //chat message
  socket.on("chatMessage", (msg, callback) => {
    const user = getUser(socket.id);
    socket.broadcast
      .to(user.room)
      .emit("message", messageFormat(user.username, msg));
    callback();
  });

  //when disconnected
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit("sysMessage", `${user.username} has left`);

      //send users and rooom info

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

//port
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
