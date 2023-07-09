import { PrismaClient } from "@prisma/client";
import { IContent, ICreateContent, IUpdateContent } from "../entity";
import { IRepositoryContent } from ".";

export function newRepositoryContent(db: PrismaClient): IRepositoryContent {
    return new RepositoryContent(db);
}

class RepositoryContent implements IRepositoryContent {
    private db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    async createContent(arg: ICreateContent): Promise<IContent> {
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

    async getContentById(id: number): Promise<IContent> {
        return await this.db.content.findUniqueOrThrow({
            where: {
                id,
            },
        });
    }

    async getContents(): Promise<IContent[]> {
        return await this.db.content.findMany({});
    }

    async updateContentById(arg: IUpdateContent): Promise<IContent> {
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

    async deleteContentById(id: number): Promise<IContent> {
        return await this.db.content.delete({
            where: {
                id,
            },
        });
    }
}
