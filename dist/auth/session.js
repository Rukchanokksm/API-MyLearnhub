"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const express_1 = __importDefault(require("express"));
// import cookieparser from "cookie-parser";
const expireTime = 1000 * 60 * 60 * 24;
const secret = "secret-academy";
async function main() {
    const server = (0, express_1.default)();
    server.use(express_1.default.json());
    server.use((0, express_session_1.default)({
        secret: secret,
        saveUninitialized: true,
        cookie: { maxAge: expireTime },
        resave: false,
    }));
}
main();
//# sourceMappingURL=session.js.map