"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlerMiddleware = exports.newJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || "content-secrets";
function newJwt(payload) {
    return jsonwebtoken_1.default.sign(payload, secret, {
        algorithm: "HS512",
        expiresIn: "12h",
        issuer: "academy",
        subject: "registration",
        audience: "students",
    });
}
exports.newJwt = newJwt;
class HandlerMiddleware {
    constructor(repo) {
        this.repoBlacklist = repo;
    }
    async jwtMiddleware(req, res, next) {
        const accessToken = req.header("Authorization")?.replace("Bearer ", "");
        try {
            if (!accessToken) {
                return res
                    .status(401)
                    .json({ error: "missing JWT token" })
                    .end();
            }
            const isBlacklisted = await this.repoBlacklist.isBlacklisted(accessToken);
            if (isBlacklisted) {
                return res.status(200).json({ status: `logged out` }).end();
            }
            const decoded = jsonwebtoken_1.default.verify(accessToken, secret);
            const id = decoded["id"];
            const username = decoded["username"];
            if (!id) {
                return res
                    .status(401)
                    .json({ error: "missing payload `id`" })
                    .end();
            }
            if (!username) {
                return res
                    .status(401)
                    .json({ error: "missing payload `username`" })
                    .end();
            }
            req.token = accessToken;
            req.payload = {
                id,
                username,
            };
            return next();
        }
        catch (err) {
            console.error(`Auth failed for token ${accessToken}: ${err}`);
            return res
                .status(401)
                .json({ error: "authentication failed" })
                .end();
        }
    }
}
exports.HandlerMiddleware = HandlerMiddleware;
//# sourceMappingURL=jwt.js.map