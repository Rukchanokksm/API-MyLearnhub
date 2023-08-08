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

    async getContentById(id: number): Promise<IContent | null> {
        return await this.db.content.findUnique({
            include: {
                postedBy: {
                    select: {
                        id: true,
                        username : true,
                        name: true,
                        registeredAt: true
                    }
                }
            },
            where: {
                id,
            },
        });
    }

    async getContents(): Promise<IContent[]> {
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

    async updateContentById(arg: IUpdateContent): Promise<IContent> {
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

    async deleteContentById(id: number): Promise<IContent> {
        return await this.db.content.delete({
            where: {
                id,
            },
        });
    }
}
