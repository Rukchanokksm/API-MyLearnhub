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
    countView?: number;
}

export interface Empty {}
