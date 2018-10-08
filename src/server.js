const express = require("express");
const socket = require("socket.io");
const lz = require("lz-string");
let {
    storeChatOnRedis,
    getChartFromRedis,
    clearCacheFromRedis
} = require("./utils/redis-client");

// express instance
const app = express();

// listening port
const server = app.listen(4001, err => {
    err
        ? console.log("app:server", `Failed to start server instance %O`, err)
        : console.log("app:server", `Listening on port ${4001}`);
});

// redis chat op
const redisOP = async data => {
    try {
        // get redis
        let result = await getChartFromRedis(`currentChat`);
        console.log(result);
        if (!result) {
            // set redis key:value
            await storeChatOnRedis(
                `currentChat`,
                //compress the json
                lz.compressToBase64(
                    JSON.stringify([
                        {
                            username: data.username,
                            message: data.message
                        }
                    ])
                ),
                "EX",
                20
            );
            console.log(data);
            return [data];
        }
        // decompress the json structure
        let redisResult = JSON.parse(lz.decompressFromBase64(result));
        redisResult.push(data);
        // set redis key:value
        await storeChatOnRedis(
            `currentChat`,
            lz.compressToBase64(JSON.stringify(redisResult)),
            "EX",
            20
        );
        console.log(redisResult);
        return redisResult;
    } catch (ex) {
        console.log(ex);
    }
};

// redis first chat op
const redisFirstOP = async () => {
    try {
        let redisResult = JSON.parse(
            lz.decompressFromBase64(await getChartFromRedis(`currentChat`))
        );
        if (!redisResult) return [];
        return redisResult;
    } catch (ex) {
        console.log(ex);
        return [];
    }
};

// clear redis cache
const redisClearOP = async () => {
    try {
        let redisResult = await clearCacheFromRedis(`currentChat`);
        return redisResult;
    } catch (ex) {
        console.log(ex);
    }
};

// Socket config
const io = socket(server);
io.on("connection", socket => {
    // connection check
    console.log(`connected successfull ${socket.id}`);

    socket.on("CLEAR_CHAT", async data => {
        await redisClearOP();
    });
    socket.on("FIRST_CALL", async data => {
        io.emit("RECEIVE_MESSAGE", await redisFirstOP());
    });
    socket.on("SEND_MESSAGE", async data => {
        io.emit("RECEIVE_MESSAGE", await redisOP(data));
    });
});
