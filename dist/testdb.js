"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
async function main() {
    const db = new client_1.PrismaClient();
    const user = {
        name: "Fast",
        username: "faster",
        password: " 1122",
    };
    const register = await db.user.create({
        data: {
            username: user.username,
            password: user.password,
            name: user.name,
        },
    });
    console.log(register);
}
main();
//# sourceMappingURL=testdb.js.map