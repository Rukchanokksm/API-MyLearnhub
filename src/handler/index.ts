import { Request } from "express";

export interface Addrequest<Params, Body> extends Request<Params, any, Body> {}

export interface ReqUser {
    username: string;
    name: string;
    password: string;
}

export interface ReqContent {
    [x: string]: any;
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
    createContentByid(req: Request, res: Response): Promise<Response>;
    getPostContents(req: Request, res: Response): Promise<Response>;
}
