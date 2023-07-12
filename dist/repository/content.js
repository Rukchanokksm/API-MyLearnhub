"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryContent = void 0;
function newRepositoryContent(db) {
    return new RepositoryContent(db);
}
exports.newRepositoryContent = newRepositoryContent;
class RepositoryContent {
    constructor(db) {
        this.db = db;
    }
    async createContent(arg) {
        return await this.db.content.create({
            include: {
                postedBy: {
                    select: {
                        id: true,
                        username: true,
                        password: false,
                        name: true,
                        registeredAt: true,
                    },
                },
            },
            data: {
                ...arg,
                ownerId: undefined,
                postedBy: {
                    connect: {
                        id: arg.ownerId,
                    },
                },
            },
        });
    }
    async getContentById(id) {
        return await this.db.content.findUnique({
            where: {
                id,
            },
        });
    }
    async getContents() {
        return await this.db.content.findMany({
            include: {
                postedBy: {
                    select: {
                        id: true,
                        username: true,
                        password: false,
                        name: true,
                        registeredAt: true,
                    },
                },
            },
        });
    }
    async updateContentById(arg) {
        const post = await this.db.content.findUnique({
            where: { id: arg.id },
        });
        if (!post) {
            return Promise.reject(`no such post ${post}`);
        }
        if (post.ownerId !== arg.ownerId) {
            return Promise.reject(`You are not owner this post!!`);
        }
        return await this.db.content.update({
            where: {
                id: arg.id,
            },
            data: {
                comment: arg.comment,
                rating: arg.rating,
            },
        });
    }
    async deleteContentById(id) {
        return await this.db.content.delete({
            where: {
                id,
            },
        });
    }
}
//# sourceMappingURL=content.js.map