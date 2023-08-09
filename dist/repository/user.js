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
        try {
            const user = await this.db.user.findUnique({
                where: {
                    username,
                }
            });
            if (!user) {
                return Promise.reject(`not found ${user}`);
            }
            return user;
        }
        catch (err) {
            console.error(err);
            return Promise.reject(`Can't get user with error ${err}`);
        }
        // return await this.db.user
        //     .findUnique({
        //         where: {
        //             username,
        //         },
        //     })
        //     .then((user) => {
        //         if (!user) {
        //             return Promise.reject(`not found ${user}`);
        //         }
        //         return Promise.resolve(user);
        //     });
    }
    async upDateUsername(arg) {
        try {
            return await this.db.user.update({
                where: {
                    username: arg.username,
                },
                data: {
                    name: arg.name,
                },
            });
        }
        catch (err) {
            console.error(err);
            return Promise.reject(`Can Update name with error ${err}`);
        }
    }
}
//# sourceMappingURL=user.js.map