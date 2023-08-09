import { Request } from "express";

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

export interface ReqUpdateName {
    name: string;
    username: string;
}

export interface Empty {}

export interface IHandlerUser {
    register(req: Addrequest<Empty, ReqUser>, res: Response): Promise<Response>;
    login(req: Addrequest<Empty, ReqUser>, res: Response): Promise<Response>;
}
