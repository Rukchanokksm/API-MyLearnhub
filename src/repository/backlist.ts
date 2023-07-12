import { RedisClientType } from "redis";
import jwt from "jsonwebtoken";
import { IRepositoryBlacklist } from ".";

const keyBlacklist = "content-jwt-blacklist";
const keyJwtExpire = "content-jwt-expirations";

export function newRepositoryBlacklist(
    db: RedisClientType<any, any, any>,
): IRepositoryBlacklist {
    return new RepositoryBlackList(db);
}

class RepositoryBlackList {
    private db: RedisClientType<any, any, any>;

    constructor(db: RedisClientType<any, any, any>) {
        this.db = db;
    }

    private async sAdd(token: string): Promise<void> {
        await this.db.sAdd(keyBlacklist, token);
    }

    async addToBlacklist(token: string): Promise<void> {
        const decoded = jwt.decode(token);
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

    async isBlacklisted(token: string): Promise<boolean> {
        return await this.db.sIsMember(keyBlacklist, token);
    }
}
