import { PrismaClient } from "@prisma/client";
import express from "express";
import { newRepository } from "./repository/user";
import { newHandlerUser } from "./handler/user";
import { newRepositoryContent } from "./repository/content";
import { newHandlerContent } from "./handler/content";

async function main() {
    const db = new PrismaClient();

    try {
        db.$connect();
    } catch (err) {
        console.error(err);
        return;
    }

    const repoUser = newRepository(db);
    const HandlerUser = newHandlerUser(repoUser);
    const repoContent = newRepositoryContent(db);
    const HandlerContent = newHandlerContent(repoContent);

    const port = process.env.PORT || 8000;
    const server = express();
    const userRouter = express.Router();
    const postRouter = express.Router();

    server.use(express.json());
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
    userRouter.post(
        "/post",
        HandlerContent.createContentByid.bind(HandlerContent),
    );

    server.listen(port, () => {
        console.log(`server is listening posrt ${port}`);
    });
}

main();
