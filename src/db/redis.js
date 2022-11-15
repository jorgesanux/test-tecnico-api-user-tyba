import { createClient } from "redis";

const client = createClient({
    url: process.env.REDIS_URL
});

client.on("connect", () => console.log("Redis client connected"));
client.on("error", (err) => console.log("Redis client error", err));

await client.connect();

export default client;