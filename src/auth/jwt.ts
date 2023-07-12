import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { IRepositoryBlacklist } from "../repository";

const secret = process.env.JWT_SECRET || "content-secrets";

export interface payload {
    id: string;
    username: string;
}

export interface JwtAuthReq<Params, Body> extends Request<Params, any, Body> {
    token: string;
    payload: payload;
}

export function newJwt(payload: payload): string {
    return jwt.sign(payload, secret, {
        algorithm: "HS512",
        expiresIn: "12h",
        issuer: "academy",
        subject: "registration",
        audience: "students",
    });
}

export class HandlerMiddleware {
    private repoBlacklist: IRepositoryBlacklist;

    constructor(repo: IRepositoryBlacklist) {
        this.repoBlacklist = repo;
    }

    async jwtMiddleware(
        req: JwtAuthReq<any, any>,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response<any, Record<string, any>>> {
        const accessToken = req.header("Authorization")?.replace("Bearer ", "");
        try {
            if (!accessToken) {
                return res
                    .status(401)
                    .json({ error: "missing JWT token" })
                    .end();
            }

            const isBlacklisted = await this.repoBlacklist.isBlacklisted(
                accessToken,
            );
            if (isBlacklisted) {
                return res.status(401).json({ status: `logged out` }).end();
            }

            const decoded = jwt.verify(accessToken, secret);
            const id = decoded["id"];
            const username = decoded["username"];

            if (!id) {
                return res
                    .status(401)
                    .json({ error: "missing payload `id`" })
                    .end();
            }
            if (!username) {
                return res
                    .status(401)
                    .json({ error: "missing payload `username`" })
                    .end();
            }

            req.token = accessToken;
            req.payload = {
                id,
                username,
            };

            return next();
        } catch (err) {
            console.error(`Auth failed for token ${accessToken}: ${err}`);
            return res
                .status(401)
                .json({ error: "authentication failed" })
                .end();
        }
    }
}
