const express = require("express");
const socket = require("socket.io");
let { storeUserOnRedis, getUserFromRedis } = require("./utils/redis-client");

const app = express();

const server = app.listen(4000, err => {
    err
        ? console.log("app:server", `Failed to start server instance %O`, err)
        : console.log("app:server", `Listening on port ${4000}`);
});

// Static file
app.use(express.static("index.js"));

// Socket config
const io = socket(server);
io.on("connection", socket => {
    console.log(`connected successfull ${socket.id}`);
    socket.on("SEND_MESSAGE", async data => {
        io.emit("RECEIVE_MESSAGE", data);
    });
});

const redisOP = async () => {
    // get redis
    let res = await getUserFromRedis(`${data.username}`);
    console.log(res);
    if (res) {
        res = res.split(",");
        res.push(data.message);
        // set redis key:value
        const result = await storeUserOnRedis(
            `${data.username}`,
            res.toString(),
            "EX",
            50
        );
        return io.emit("RECEIVE_MESSAGE", {
            username: data.username,
            message: res
        });
    }
    // set redis key:value
    const result = await storeUserOnRedis(
        `${data.username}`,
        JSON.stringify({
            username: data.username,
            message: data.message
        }),
        "EX",
        50
    );
    console.log(result);
};
