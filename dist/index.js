"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const user_1 = require("./repository/user");
const user_2 = require("./handler/user");
const content_1 = require("./repository/content");
const content_2 = require("./handler/content");
async function main() {
    const db = new client_1.PrismaClient();
    try {
        db.$connect();
    }
    catch (err) {
        console.error(err);
        return;
    }
    const repoUser = (0, user_1.newRepository)(db);
    const HandlerUser = (0, user_2.newHandlerUser)(repoUser);
    const repoContent = (0, content_1.newRepositoryContent)(db);
    const HandlerContent = (0, content_2.newHandlerContent)(repoContent);
    const port = process.env.PORT || 8000;
    const server = (0, express_1.default)();
    const userRouter = express_1.default.Router();
    const postRouter = express_1.default.Router();
    server.use(express_1.default.json());
    server.use("/user", userRouter);
    server.use("/post", postRouter);
    //check sever status
    server.get("/", (_, res) => {
        return res.status(200).json({ status: " ok " }).end();
    });
    //User API
    userRouter.post("/register", HandlerUser.register.bind(HandlerUser));
    userRouter.post("/login", HandlerUser.login.bind(HandlerUser));
    //Create Post
    userRouter.post("/post", HandlerContent.createContentByid.bind(HandlerContent));
    server.listen(port, () => {
        console.log(`server is listening posrt ${port}`);
    });
}
main();
//# sourceMappingURL=index.js.map