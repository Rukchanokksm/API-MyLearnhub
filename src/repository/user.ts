import { PrismaClient } from "@prisma/client";
import { ICreateuser, IUdateUserName, IUser } from "../entity";
import { IRepositoryUser } from ".";

export function newRepository(db: PrismaClient) {
    return new RepositoryUser(db);
}

class RepositoryUser implements IRepositoryUser {
    private db: PrismaClient;
    constructor(db: PrismaClient) {
        this.db = db;
    }

    async createUser(user: ICreateuser): Promise<IUser> {
        return await this.db.user.create({
            data: user,
        });
    }

    async getUser(username: string): Promise<IUser | null> {
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

    async upDateUsername(arg: IUdateUserName): Promise<IUser> {
        try {
            const user = await this.db.user.findUnique({
                where: {
                    username: arg.username,
                },
            });
            if (!user) {
                return Promise.reject("Not found");
            }
            if (user.username !== arg.username) {
                return Promise.reject("Not your name !");
            }

            return await this.db.user.update({
                where: {
                    id: user.username,
                },
                data: {
                    name: arg.name,
                },
            });
        } catch (err) {
            console.error(err);
            return Promise.reject(`Can Update name with error ${err}`);
        }
    }
}
