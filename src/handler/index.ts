import { Request } from "express";
import { JwtAuthReq } from "../auth/jwt";

export interface Addrequest<Params, Body> extends Request<Params, any, Body> {}

export interface ReqUser {
    username: string;
    name: string;
    password: string;
}

export interface ReqId {
    id: number;
}

export interface ReqContent {
    videoUrl: string;
    comment: string;
    rating: number;
}

export interface Empty {}

export interface IHandlerUser {
    register(req: Addrequest<Empty, ReqUser>, res: Response): Promise<Response>;
    login(req: Addrequest<Empty, ReqUser>, res: Response): Promise<Response>;
}

export interface IHandlerContent {
    createContentByid(
        req: JwtAuthReq<Empty, ReqContent>,
        res: Response,
    ): Promise<Response>;
    getPostContents(
        req: JwtAuthReq<Request, any>,
        res: Response,
    ): Promise<Response>;
}
