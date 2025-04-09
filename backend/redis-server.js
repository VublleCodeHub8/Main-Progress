const Redis = require('ioredis');

const redis = new Redis({
    port: 6380,
    host: 'localhost',
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000); 
        return delay;
    }
});

function generateCacheKey(req, email) {
    const baseUrl = req.path
        .replace(/^\/+|\/+$/g, '')  // remove leading/trailing slashes
        .replace(/\//g, ':');       // convert slashes to colons

    return `${baseUrl}:${email}`;
}

module.exports = { redis, generateCacheKey };
