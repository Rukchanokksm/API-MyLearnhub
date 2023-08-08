import { PrismaClient } from "@prisma/client";
import { ICreateuser, IUser } from "../entity";
import { IRepositoryUser } from ".";

export function newRepository(db: PrismaClient): IRepositoryUser {
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

    // async upDateUsername(id : string): Promise<IUser> {
    //     try {
    //         const username
    //     }catch(err){
    //         console.error(err)
    //         return Promise.reject(`can't get user with error code ${err}`)
    //     }
    //      await this.db.user.findUnique({
    //         where: {
    //             id
    //         }
    //     })
    // }
}
