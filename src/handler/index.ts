import { Response } from "express";
import { Addrequest, Empty, ReqUser } from "../auth";
import { JwtAuthReq } from "../auth/jwt";

export interface ReqDeleteId {
    id: number;
    ownerId: string;
}

export interface ReqUpdateName {
    name: string;
    username: string;
}

export interface IHandlerUser {
    register(req: Addrequest<Empty, ReqUser>, res: Response): Promise<Response>;
    login(req: Addrequest<Empty, ReqUser>, res: Response): Promise<Response>;
    logout(req: JwtAuthReq<Empty, Empty>, res: Response): Promise<Response>;
    getloginUser(
        req: JwtAuthReq<Empty, Empty>,
        res: Response,
    ): Promise<Response>;
    UpdateUsername(
        req: JwtAuthReq<Empty, ReqUpdateName>,
        res: Response,
    ): Promise<Response>;
}
