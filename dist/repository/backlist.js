"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryBlacklist = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keyBlacklist = "content-jwt-blacklist";
const keyJwtExpire = "content-jwt-expirations";
function newRepositoryBlacklist(db) {
    return new RepositoryBlackList(db);
}
exports.newRepositoryBlacklist = newRepositoryBlacklist;
class RepositoryBlackList {
    constructor(db) {
        this.db = db;
    }
    async sAdd(token) {
        await this.db.sAdd(keyBlacklist, token);
    }
    async addToBlacklist(token) {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded) {
            return this.sAdd(token);
        }
        if (typeof decoded === "string") {
            return this.sAdd(token);
        }
        const exp = decoded.exp;
        if (!exp) {
            return this.sAdd(token);
        }
        await this.sAdd(token);
        await this.db.hSet(keyJwtExpire, token, exp);
    }
    async isBlacklisted(token) {
        return await this.db.sIsMember(keyBlacklist, token);
    }
}
//# sourceMappingURL=backlist.js.map