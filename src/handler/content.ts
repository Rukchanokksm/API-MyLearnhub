// import { IHandlerContent } from ".";
import { Addrequest, Empty, ReqContent } from ".";
import { IRepositoryContent } from "../repository";
import { Request, Response } from "express";
import { getVideoDetails } from "../service/oembeb";

interface IHandlerContent {
    createContentByid(req: Request, res: Response): Promise<Response>;
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
        req: Addrequest<Empty, ReqContent>,
        res: Response,
    ): Promise<Response> {
        const { videoUrl, comment, rating } = req.body;
        if (!videoUrl || !comment || !rating) {
            return res.status(500).json({ err: "massage is Empty" });
        }
        try {
            console.log(videoUrl);
            const Oemb = await getVideoDetails(videoUrl);
            console.log(Oemb);
            const ownerId = req.body.id;
            const contentVal = {
                videoUrl,
                comment,
                rating,
                ownerId,
                Oemb,
            };
            const created = await this.repo.createContent({
                ...contentVal,
                videoTitle: Oemb.videoTitle,
                thumbnailUrl: Oemb.thumbnailUrl,
                creatorName: Oemb.creatorName,
                creatorUrl: Oemb.creatorUrl,
            });
            return res.status(200).json(created).end();
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ err: `Cannot Create post err : ${err}` });
        }
    }

    async getPostContents(_: Request, res: Response): Promise<Response> {
        try {
            const getContents = this.repo.getContents();
            return res.status(200).json(getContents).end();
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ err: ` Cannot get content err : ${err}` })
                .end();
        }
    }

    async getPostContentById(req: Request, res: Response): Promise<Response> {
        try {
            const getContentId = this.repo.getContentById(req.body);
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
        req: Request,
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
        try {
            const updateContent = await this.repo.updateContentById({
                id,
                ownerId: req.params.id,
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
