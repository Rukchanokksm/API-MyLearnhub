import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import { newRepository } from "./repository/user";
import { newHandlerUser } from "./handler/user";
import { newRepositoryContent } from "./repository/content";
import { newHandlerContent } from "./handler/content";
import { createClient } from "redis";
import { HandlerMiddleware } from "./auth/jwt";
import { newRepositoryBlacklist } from "./repository/backlist";

async function main() {
    const db = new PrismaClient();
    const redis = createClient();

    try {
        await redis.connect();
        await db.$connect();
    } catch (err) {
        console.error(err);
        return;
    }

    const repoUser = newRepository(db);
    const repoBlacklist = newRepositoryBlacklist(redis);
    const HandlerUser = newHandlerUser(repoUser, repoBlacklist);
    const repoContent = newRepositoryContent(db);
    const HandlerContent = newHandlerContent(repoContent);

    const handlerMiddlerWare = new HandlerMiddleware(repoBlacklist);

    const port = process.env.PORT || 8000;
    const server = express();
    const userRouter = express.Router();
    const contentRouter = express.Router();
    const auth = express.Router();

    server.use(cors());
    server.use(express.json());
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
    auth.get(
        "/me",
        handlerMiddlerWare.jwtMiddleware.bind(handlerMiddlerWare),
        HandlerUser.getloginUser.bind(HandlerUser),
    );
    userRouter.get(
        "/logout",
        handlerMiddlerWare.jwtMiddleware.bind(handlerMiddlerWare),
        HandlerUser.logout.bind(HandlerUser),
    );

    //Create contant
    contentRouter.post(
        "/",
        handlerMiddlerWare.jwtMiddleware.bind(handlerMiddlerWare),
        HandlerContent.createContentByid.bind(HandlerContent),
    );

    //get all content
    contentRouter.get("/", HandlerContent.getPostContents.bind(HandlerContent));
    //Get content by id
    contentRouter.get(
        "/:id",
        HandlerContent.getPostContentById.bind(HandlerContent),
    );

    //update content
    contentRouter.patch(
        "/update/:id",
        handlerMiddlerWare.jwtMiddleware.bind(handlerMiddlerWare),
        HandlerContent.updatePostContentById.bind(HandlerContent),
    );
    //delete content
    contentRouter.delete(
        "/delete/:id",
        handlerMiddlerWare.jwtMiddleware.bind(handlerMiddlerWare),
        HandlerContent.deleteContentById.bind(HandlerContent)
    )

    server.listen(port, () => {
        console.log(`server is listening posrt ${port}`);
    });
}

main();
