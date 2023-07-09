"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepository = void 0;
function newRepository(db) {
    return new RepositoryUser(db);
}
exports.newRepository = newRepository;
class RepositoryUser {
    constructor(db) {
        this.db = db;
    }
    async createUser(user) {
        return await this.db.user.create({
            data: user,
        });
    }
    async getUser(username) {
        return await this.db.user
            .findUnique({
            where: {
                username,
            },
        })
            .then((user) => {
            if (!user) {
                return Promise.reject(`not found ${user}`);
            }
            return Promise.resolve(user);
        });
    }
}
//# sourceMappingURL=user.js.map