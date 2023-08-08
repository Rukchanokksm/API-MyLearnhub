"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerContent = void 0;
const oembeb_1 = require("../service/oembeb");
function newHandlerContent(repo) {
    return new HandlerContent(repo);
}
exports.newHandlerContent = newHandlerContent;
class HandlerContent {
    constructor(repo) {
        this.repo = repo;
    }
    async createContentByid(req, res) {
        const { videoUrl, comment, rating } = req.body;
        if (!videoUrl || !comment || !rating) {
            return res.status(500).json({ err: "massage is Empty" }).end();
        }
        try {
            const Oemb = await (0, oembeb_1.getVideoDetails)(videoUrl);
            // console.log(Oemb);
            const ownerId = req.payload.id;
            // console.log(ownerId);
            const contentVal = {
                comment,
                rating,
                ownerId,
            };
            const created = await this.repo.createContent({
                ...contentVal,
                ...Oemb,
            });
            return res
                .status(201)
                .json({ ...created, ownerId: undefined })
                .end();
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ err: `Cannot Create post err : ${err}` });
        }
    }
    async getPostContents(_, res) {
        try {
            const getContents = await this.repo.getContents();
            return res.status(200).json({ data: getContents }).end();
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ err: ` Cannot get content err : ${err}` })
                .end();
        }
    }
    async getPostContentById(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(500)
                .json({ err: `Not Found post number ${req.params.id}` });
        }
        try {
            const getContentId = await this.repo.getContentById(id);
            return res.status(200).json(getContentId).end();
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ err: `Cannot get content err : ${err}` })
                .end();
        }
    }
    async updatePostContentById(req, res) {
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
        }
        catch (err) {
            return res
                .status(500)
                .json({ err: `Cannot update Conetent error code's : ${err}` });
        }
    }
    async deleteContentById(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(401).json({ err: "Id is not a number" }).end();
        }
        try {
            const owner = req.payload.id;
            const getId = await this.repo.getContentById(id);
            if (!getId?.ownerId) {
                return res.status(400).json({ err: `Not found content id ${id}` }).end();
            }
            if (owner !== getId.ownerId) {
                return res.status(500).json({ err: `Your not content onwer` }).end();
            }
            await this.repo.deleteContentById(id);
            return res.status(200).json(`delete complete`).end();
        }
        catch (err) {
            return res.status(500).json({ err: `Can't delete content id is ${id} with error code ${err}` }).end();
        }
    }
}
//# sourceMappingURL=content.js.map