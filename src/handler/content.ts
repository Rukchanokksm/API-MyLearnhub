// import { IHandlerContent } from ".";
import { Empty, ReqContent, ReqId } from ".";
import { IRepositoryContent } from "../repository";
import { Request, Response } from "express";
import { getVideoDetails } from "../service/oembeb";
import { JwtAuthReq } from "../auth/jwt";

interface IHandlerContent {
    createContentByid(
        req: JwtAuthReq<Empty, ReqContent>,
        res: Response,
    ): Promise<Response>;
    getPostContents(req: Request, res: Response): Promise<Response>;
}

export function newHandlerContent(repo: IRepositoryContent) {
    return new HandlerContent(repo);
}

class HandlerContent implements IHandlerContent {
    private repo: IRepositoryContent;
    constructor(repo: IRepositoryContent) {
        this.repo = repo;
    }

    async createContentByid(
        req: JwtAuthReq<Empty, ReqContent>,
        res: Response,
    ): Promise<Response> {
        const { videoUrl, comment, rating } = req.body;
        if (!videoUrl || !comment || !rating) {
            return res.status(500).json({ err: "massage is Empty" });
        }
        try {
            const Oemb = await getVideoDetails(videoUrl);
            // console.log(Oemb);
            const ownerId = req.payload.id;
            // console.log(ownerId);
            const contentVal = {
                videoUrl,
                comment,
                rating,
                ownerId,
            };
            const created = await this.repo.createContent({
                ...contentVal,
                ...Oemb,
            });
            return res.status(200).json(created.ownerId).end();
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ err: `Cannot Create post err : ${err}` });
        }
    }

    async getPostContents(_: any, res: Response): Promise<Response> {
        try {
            const getContents = this.repo.getContents();
            return res.status(200).json({ data: getContents }).end();
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ err: ` Cannot get content err : ${err}` })
                .end();
        }
    }

    async getPostContentById(
        req: JwtAuthReq<ReqId, Empty>,
        res: Response,
    ): Promise<Response> {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(500)
                .json({ err: `Not Found post number ${req.params.id}` });
        }
        try {
            const getContentId = this.repo.getContentById(id);
            return res.status(200).json(getContentId).end();
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ err: `Cannot get content err : ${err}` })
                .end();
        }
    }

    async updatePostContentById(
        req: JwtAuthReq<ReqId, ReqContent>,
        res: Response,
    ): Promise<Response> {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ err: `not found ${id}` })
                .end();
        }
        const { comment, rating } = req.body;
        if (!comment && !rating) {
            return res.status(500).json({ err: `Can update ` }).end();
        }
        if (rating > 5 || rating < 0) {
            return res
                .status(500)
                .json({ err: "Rating is not over 5 and lower 0" })
                .end();
        }
        try {
            const updateContent = await this.repo.updateContentById({
                id,
                ownerId: req.payload.id,
                comment,
                rating,
            });
            return res.status(200).json(`Update Done : ${updateContent}`).end();
        } catch (err) {
            return res
                .status(500)
                .json({ err: `Cannot update Conetent error code's : ${err}` });
        }
    }
}
