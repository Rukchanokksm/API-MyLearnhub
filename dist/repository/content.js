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
                owner: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        registedAt: true,
                    },
                },
            },
            data: {
                comment: arg.comment,
                videoTitle: arg.videoTitle,
                videoUrl: arg.videoUrl,
                thumbnailUrl: arg.thumbnailUrl,
                creatorName: arg.creatorName,
                creatorUrl: arg.creatorUrl,
                rating: arg.rating,
                owner: {
                    connect: {
                        id: arg.ownerId,
                    },
                },
            },
        });
    }
    async getContentById(id) {
        return await this.db.content.findUniqueOrThrow({
            where: {
                id,
            },
        });
    }
    async getContents() {
        return await this.db.content.findMany({});
    }
    async updateContentById(arg) {
        return await this.db.content.update({
            where: {
                id: arg.ownerId,
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