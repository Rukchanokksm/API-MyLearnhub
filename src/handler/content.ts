// import { IHandlerContent } from ".";
import { Empty, ReqContent, ReqId } from "../auth/index";
import { IRepositoryContent } from "../repository";
import { Request, Response } from "express";
import { getVideoDetails } from "../service/oembeb";
import { JwtAuthReq } from "../auth/jwt";
import { IContent } from "../entity";
import { ReqDeleteId } from ".";
interface IHandlerContent {
    createContentByid(
        req: JwtAuthReq<Empty, ReqContent>,
        res: Response
    ): Promise<Response>;
    getPostContents(req: Request, res: Response): Promise<Response>;
    getPostContentById(
        req: JwtAuthReq<ReqId, Empty>,
        res: Response
    ): Promise<Response>;
    updatePostContentById(
        req: JwtAuthReq<ReqId, ReqContent>,
        res: Response
    ): Promise<Response>;
    deleteContentById(
        req: JwtAuthReq<ReqId, Empty>,
        res: Response
    ): Promise<Response>;
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
        res: Response
    ): Promise<Response> {
        const { videoUrl, comment, rating } = req.body;
        if (!videoUrl || !comment || !rating) {
            return res.status(500).json({ err: "massage is Empty" }).end();
        }
        try {
            const Oemb = await getVideoDetails(videoUrl);
            // console.log(Oemb);
            const ownerId = req.payload.id;
            // console.log(ownerId);
            const contentVal = {
                comment,
                rating,
                ownerId
            };
            const created: IContent = await this.repo.createContent({
                ...contentVal,
                ...Oemb,
                countView: 0
            });
            return res
                .status(201)
                .json({ ...created, ownerId: undefined })
                .end();
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ err: `Cannot Create post err : ${err}` });
        }
    }

    async getPostContents(_, res: Response): Promise<Response> {
        try {
            const getContents = await this.repo.getContents();
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
        res: Response
    ): Promise<Response> {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(500)
                .json({ err: `Not Found post number ${req.params.id}` });
        }
        try {
            const getContentId = await this.repo.getContentById(id);
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
        res: Response
    ): Promise<Response> {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ err: `not found ${id}` })
                .end();
        }
        const { comment, rating } = req.body;
        let { countView } = req.body;

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
            //get current count view
            const contentData = await this.repo.getContentById(id);
            let isCount = 0;
            if (countView && contentData?.countView) {
                isCount = countView! + contentData?.countView!;
            }
            const updateContent = await this.repo.updateContentById({
                id,
                ownerId: req.payload.id,
                comment,
                rating,
                countView: isCount
            });
            return res
                .status(200)
                .json({ massage: `Update Done ${updateContent}` })
                .end();
        } catch (err) {
            return res
                .status(500)
                .json({ err: `Cannot update Conetent error code's : ${err}` });
        }
    }

    async deleteContentById(
        req: JwtAuthReq<ReqDeleteId, Empty>,
        res: Response
    ): Promise<Response> {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(401).json({ err: "Id is not a number" }).end();
        }
        try {
            const owner = req.payload.id;
            const getId = await this.repo.getContentById(id);
            if (!getId?.ownerId) {
                return res
                    .status(400)
                    .json({ err: `Not found content id ${id}` })
                    .end();
            }
            if (owner !== getId.ownerId) {
                return res
                    .status(500)
                    .json({ err: `Your not content onwer` })
                    .end();
            }
            await this.repo.deleteContentById(id);
            return res.status(200).json({ massage: `delete complete` }).end();
        } catch (err) {
            return res
                .status(500)
                .json({
                    err: `Can't delete content id is ${id} with error code ${err}`
                })
                .end();
        }
    }
}
