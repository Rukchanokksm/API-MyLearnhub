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
            return res.status(500).json({ err: "massage is Empty" });
        }
        try {
            console.log(videoUrl);
            const Oemb = await (0, oembeb_1.getVideoDetails)(videoUrl);
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
            const getContents = this.repo.getContents();
            return res.status(200).json(getContents).end();
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
        try {
            const getContentId = this.repo.getContentById(req.body);
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
}
//# sourceMappingURL=content.js.map