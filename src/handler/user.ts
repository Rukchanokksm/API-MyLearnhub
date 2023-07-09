import { Addrequest, Empty, ReqUser } from ".";
import { IRepositoryUser } from "../repository";
import { Response } from "express";

export interface IHandlerUser {
    register(req: Addrequest<Empty, ReqUser>, res: Response): Promise<Response>;
    login(req: Addrequest<Empty, ReqUser>, res: Response): Promise<Response>;
}

export function newHandlerUser(repo: IRepositoryUser): IHandlerUser {
    return new HandlerUser(repo);
}

class HandlerUser implements IHandlerUser {
    private repo: IRepositoryUser;

    constructor(repo: IRepositoryUser) {
        this.repo = repo;
    }

    async register(
        req: Addrequest<Empty, ReqUser>,
        res: Response,
    ): Promise<Response> {
        const { username, name, password } = req.body;
        if (!username || !name || !password) {
            return res
                .status(400)
                .json({ err: "Missing username , name or password" })
                .end();
        }

        return await this.repo
            .createUser({ username, name, password })
            .then((user) =>
                res
                    .status(201)
                    .json({ ...user, password: undefined })
                    .end(),
            )
            .catch((err) => {
                const errMsg = `failed to create user ${username}`;
                console.error(`${errMsg}: ${err}`);
                return res.status(500).json({ error: errMsg }).end();
            });
    }

    async login(
        req: Addrequest<Empty, ReqUser>,
        res: Response,
    ): Promise<Response> {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(401)
                .json({ err: "missing username or password !" })
                .end();
        }
        return await this.repo
            .getUser(username)
            .then((user) => {
                if (!user?.username || !user.password) {
                    return res
                        .status(401)
                        .json({ err: "ivalid username or password" })
                        .end();
                }
                return res
                    .status(200)
                    .json({
                        status: "login ok",
                    })
                    .end();
            })
            .catch((err) => {
                console.log(`failed to login ${err}`);
                return res.status(500).end();
            });
    }
}
