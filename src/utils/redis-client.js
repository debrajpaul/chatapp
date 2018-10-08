const redis = require("redis");
const bluebird = require("bluebird");

/*
*   Promisify redis :-
*   it cover redis instance to Promisify redis instance using bluebird framework
*/
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

/*
*   Instance of redis:-
*   redis config file
*/
let client = redis.createClient(6379, "localhost");
client.on("ready", function() {
    console.log("Redis is ready");
});

// Error handling
client.on("error", function() {
    console.log("app:redis-client", "Failed to connect to redis:\n%O", err);
    process.exit(1);
});

// Setter function to store data in redis
function storeChatOnRedis(key, val) {
    return client.setAsync(key, val);
}

// Getter function to fetch data from redis
function getChartFromRedis(key) {
    return client.getAsync(key);
}

// Getter function to fetch data from redis
function clearCacheFromRedis(key) {
    return client.delAsync(key);
}

module.exports = { storeChatOnRedis, getChartFromRedis, clearCacheFromRedis };
