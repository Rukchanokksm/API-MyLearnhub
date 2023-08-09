"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./repository/user");
const user_2 = require("./handler/user");
const content_1 = require("./repository/content");
const content_2 = require("./handler/content");
const redis_1 = require("redis");
const jwt_1 = require("./auth/jwt");
const backlist_1 = require("./repository/backlist");
async function main() {
    const db = new client_1.PrismaClient();
    const redis = (0, redis_1.createClient)();
    try {
        await redis.connect();
        await db.$connect();
    }
    catch (err) {
        console.error(err);
        return;
    }
    const repoUser = (0, user_1.newRepository)(db);
    const repoBlacklist = (0, backlist_1.newRepositoryBlacklist)(redis);
    const HandlerUser = (0, user_2.newHandlerUser)(repoUser, repoBlacklist);
    const repoContent = (0, content_1.newRepositoryContent)(db);
    const HandlerContent = (0, content_2.newHandlerContent)(repoContent);
    const handlerMiddlerWare = new jwt_1.HandlerMiddleware(repoBlacklist);
    const port = process.env.PORT || 8000;
    const server = (0, express_1.default)();
    const userRouter = express_1.default.Router();
    const contentRouter = express_1.default.Router();
    const auth = express_1.default.Router();
    server.use((0, cors_1.default)());
    server.use(express_1.default.json());
    server.use("/auth", auth);
    server.use("/user", userRouter);
    server.use("/content", contentRouter);
    //check sever status
    server.get("/", (_, res) => {
        return res.status(200).json({ status: " ok " }).end();
    });
    //User API
    //Register
    userRouter.post("/", HandlerUser.register.bind(HandlerUser));
    auth.post("/login", HandlerUser.login.bind(HandlerUser));
    auth.get("/me", handlerMiddlerWare.jwtMiddleware.bind(handlerMiddlerWare), HandlerUser.getloginUser.bind(HandlerUser));
    userRouter.get("/logout", handlerMiddlerWare.jwtMiddleware.bind(handlerMiddlerWare), HandlerUser.logout.bind(HandlerUser));
    userRouter.patch("/update", handlerMiddlerWare.jwtMiddleware.bind(handlerMiddlerWare), HandlerUser.UpdateUsername.bind(HandlerUser));
    //Create contant
    contentRouter.post("/", handlerMiddlerWare.jwtMiddleware.bind(handlerMiddlerWare), HandlerContent.createContentByid.bind(HandlerContent));
    //get all content
    contentRouter.get("/", HandlerContent.getPostContents.bind(HandlerContent));
    //Get content by id
    contentRouter.get("/:id", HandlerContent.getPostContentById.bind(HandlerContent));
    //update content
    contentRouter.patch("/update/:id", handlerMiddlerWare.jwtMiddleware.bind(handlerMiddlerWare), HandlerContent.updatePostContentById.bind(HandlerContent));
    //delete content
    contentRouter.delete("/delete/:id", handlerMiddlerWare.jwtMiddleware.bind(handlerMiddlerWare), HandlerContent.deleteContentById.bind(HandlerContent));
    server.listen(port, () => {
        console.log(`server is listening posrt ${port}`);
    });
}
main();
//# sourceMappingURL=index.js.map