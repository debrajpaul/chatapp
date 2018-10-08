const express = require("express");
const socket = require("socket.io");
const lz = require("lz-string");
let { storeUserOnRedis, getUserFromRedis } = require("./utils/redis-client");

const app = express();

const server = app.listen(4001, err => {
    err
        ? console.log("app:server", `Failed to start server instance %O`, err)
        : console.log("app:server", `Listening on port ${4001}`);
});

// Static file
app.use(express.static("index.js"));

const redisOP = async data => {
    try {
        // get redis
        let result = await getUserFromRedis(`currentChat`);
        console.log(result);
        if (!result) {
            // set redis key:value
            await storeUserOnRedis(
                `currentChat`,
                lz.compressToBase64(
                    JSON.stringify([
                        {
                            username: data.username,
                            message: data.message
                        }
                    ])
                ),
                "EX",
                50
            );
            console.log(data);
            return [data];
        }
        let redisResult = JSON.parse(lz.decompressFromBase64(result));
        redisResult.push(data);
        // set redis key:value
        await storeUserOnRedis(
            `currentChat`,
            lz.compressToBase64(JSON.stringify(redisResult)),
            "EX",
            50
        );
        console.log(redisResult);
        return redisResult;
    } catch (ex) {
        console.log(ex);
    }
};

const redisFirstOP = async () => {
    try {
        let redisResult = JSON.parse(
            lz.decompressFromBase64(await getUserFromRedis(`currentChat`))
        );
        return redisResult;
    } catch (ex) {
        console.log(ex);
    }
};

// Socket config
const io = socket(server);
io.on("connection", socket => {
    console.log(`connected successfull ${socket.id}`);
    socket.on("FIRST_CALL", async data => {
        io.emit("RECEIVE_MESSAGE", await redisFirstOP());
    });
    socket.on("SEND_MESSAGE", async data => {
        io.emit("RECEIVE_MESSAGE", await redisOP(data));
    });
});
