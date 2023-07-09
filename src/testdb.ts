import { PrismaClient } from "@prisma/client";

async function main() {
    const db = new PrismaClient();

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
