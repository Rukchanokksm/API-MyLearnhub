"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerUser = void 0;
const bcrytp_1 = require("../auth/bcrytp");
const jwt_1 = require("../auth/jwt");
function newHandlerUser(repo, repoBlacklist) {
    return new HandlerUser(repo, repoBlacklist);
}
exports.newHandlerUser = newHandlerUser;
class HandlerUser {
    constructor(repo, repoBlacklist) {
        this.repo = repo;
        this.repoBlacklist = repoBlacklist;
    }
    async register(req, res) {
        const { username, name, password } = req.body;
        if (!username || !name || !password) {
            return res
                .status(400)
                .json({ err: "Missing username , name or password" })
                .end();
        }
        try {
            const isRegis = await this.repo.createUser({
                username,
                name,
                password: (0, bcrytp_1.hashPassWord)(password),
            });
            return res
                .status(201)
                .json({ ...isRegis, password: undefined })
                .end();
        }
        catch (err) {
            const errMsg = `failed to create user ${username}`;
            console.error(`${errMsg}: ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    async login(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(401)
                .json({ err: "missing username or password !" })
                .end();
        }
        return await this.repo
            .getUser(username)
            .then((user) => {
            if (!user) {
                return res.status(401).end();
            }
            if (!(0, bcrytp_1.comparePassWord)(password, user.password)) {
                return res
                    .status(401)
                    .json({ err: "ivalid username or password" })
                    .end();
            }
            const payload = {
                id: user.id,
                username: user.username,
            };
            const token = (0, jwt_1.newJwt)(payload);
            return res
                .status(200)
                .json({
                // status: "login ok",
                accessToken: token,
                id: user.id,
                username: user.username,
                name: user.name,
                registeredAt: user.registeredAt,
            })
                .end();
        })
            .catch((err) => {
            console.log(`failed to login ${err}`);
            return res.status(500).end();
        });
    }
    async getloginUser(req, res) {
        const username = req.payload.username;
        if (!username) {
            return res
                .status(400)
                .json({ err: `Cannot get ${username}` })
                .end();
        }
        try {
            const getUser = await this.repo.getUser(username);
            return res.status(200).json({
                id: getUser?.id,
                username: getUser?.username,
                name: getUser?.name,
                registeredAt: getUser?.registeredAt,
            });
        }
        catch (err) {
            const errMsg = `Can't Found ${username}`;
            console.error(`${errMsg}: ${err}`);
            return res
                .status(401)
                .json({ statusCode: 0, message: "string", error: "string" })
                .end();
        }
    }
    async logout(req, res) {
        try {
            const listToekn = await this.repoBlacklist.addToBlacklist(req.token);
            return res
                .status(200)
                .json({ status: "log out done", listToekn })
                .end();
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ error: `could not log out with token ${req.token}` })
                .end();
        }
    }
}
//# sourceMappingURL=user.js.map