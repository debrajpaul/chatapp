const redis = require("redis");
const bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let client = redis.createClient(6379, "localhost");
client.on("ready", function() {
    console.log("Redis is ready");
});

client.on("error", function() {
    console.log("app:redis-client", "Failed to connect to redis:\n%O", err);
    process.exit(1);
});

function storeUserOnRedis(key, val) {
    return client.setAsync(key, val);
}

function getUserFromRedis(key) {
    return client.getAsync(key);
}

module.exports = { storeUserOnRedis, getUserFromRedis };
