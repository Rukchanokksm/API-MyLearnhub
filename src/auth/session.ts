import sessions from "express-session";
import express from "express";
// import cookieparser from "cookie-parser";

const expireTime = 1000 * 60 * 60 * 24;
const secret = "secret-academy";

async function main() {
    const server = express();

    server.use(express.json());

    server.use(
        sessions({
            secret: secret,
            saveUninitialized: true,
            cookie: { maxAge: expireTime },
            resave: false,
        }),
    );
}

main();
