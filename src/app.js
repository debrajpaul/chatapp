const express = require("express");
const socket = require("socket.io");
const userRouter = require("./router/user-router");

const app = express();

const server = app.listen(4000, err => {
    err
        ? console.log("app:server", `Failed to start server instance %O`, err)
        : console.log("app:server", `Listening on port ${4000}`);
});

// Static file
app.use(express.static("src/UI"));

// Socket config
const io = socket(server);
io.on("connection", socket => {
    console.log(`connected successfull ${socket.id}`);

    socket.on("chat", data => {
        io.sockets.emit("chat", data);
    });

    socket.on("typing", data => {
        socket.broadcast.emit("typing", data);
    });
});
