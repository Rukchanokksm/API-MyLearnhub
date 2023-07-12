import bcryptjs from "bcryptjs";

export function hashPassWord(password: string): string {
    const salt = bcryptjs.genSaltSync(12);
    return bcryptjs.hashSync(password, salt);
}

export function comparePassWord(password: string, hashed: string): boolean {
    return bcryptjs.compareSync(password, hashed);
}
