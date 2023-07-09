import { PrismaClient } from "@prisma/client";
import { ICreateuser, Iuser } from "../entity";
import { IRepositoryUser } from ".";

export function newRepository(db: PrismaClient): IRepositoryUser {
    return new RepositoryUser(db);
}

class RepositoryUser implements IRepositoryUser {
    private db: PrismaClient;
    constructor(db: PrismaClient) {
        this.db = db;
    }

    async createUser(user: ICreateuser): Promise<Iuser> {
        return await this.db.user.create({
            data: user,
        });
    }

    async getUser(username: string): Promise<Iuser | null> {
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
